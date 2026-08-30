/**
 * NILAYAA INTERIORS — NEXT-GEN 3D CONFIGURATOR & HUD CONTROLLER
 * Web Audio Synthetic Haptic Sound, Object Inspector HUD, Blueprint Toggle & Keyboard Shortcuts
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize 3D Showroom
  const showroom = new Nilayaa3DShowroom('webgl-container');
  window.nilayaaShowroom = showroom;

  // --------------------------------------------------------------------------
  // 1. WEB AUDIO API SYNTHETIC HAPTIC SOUND SYSTEM (Zero External Files)
  // --------------------------------------------------------------------------
  class AudioHaptics {
    constructor() {
      this.ctx = null;
      this.soundEnabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.ctx = new AudioContext();
      }
    }

    playClick(freq = 850, type = 'sine', duration = 0.04) {
      if (!this.soundEnabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + duration);

        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (err) {
        // Audio policy ignore
      }
    }

    playChime() {
      if (!this.soundEnabled) return;
      this.init();
      if (!this.ctx) return;

      [523.25, 659.25, 783.99].forEach((freq, i) => {
        setTimeout(() => this.playClick(freq, 'triangle', 0.12), i * 60);
      });
    }
  }

  const haptics = new AudioHaptics();
  window.nilayaaHaptics = haptics;

  // Sound Toggle Button
  const soundToggleBtn = document.getElementById('btn-sound-toggle');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      haptics.soundEnabled = !haptics.soundEnabled;
      soundToggleBtn.classList.toggle('active', haptics.soundEnabled);
      if (haptics.soundEnabled) {
        haptics.playChime();
        showToast('Spatial Audio Feedback Enabled');
      } else {
        showToast('Spatial Audio Muted');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. ROOM SWITCHER CONTROLS
  // --------------------------------------------------------------------------
  const roomBtns = document.querySelectorAll('[data-room-switch]');
  roomBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      haptics.playClick(950);
      roomBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const roomKey = btn.getAttribute('data-room-switch');
      showroom.switchRoom(roomKey);
      showToast(`Entering ${btn.textContent.trim().toUpperCase()}`);
    });
  });

  // --------------------------------------------------------------------------
  // 3. LIGHTING MOOD SWITCHER
  // --------------------------------------------------------------------------
  const lightBtns = document.querySelectorAll('[data-lighting]');
  lightBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      haptics.playClick(700);
      lightBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-lighting');
      showroom.setLightingMode(mode);
      showToast(`Lighting ambiance set to ${mode.toUpperCase()}`);
    });
  });

  // --------------------------------------------------------------------------
  // 4. ARCHITECTURAL BLUEPRINT / X-RAY TOGGLE
  // --------------------------------------------------------------------------
  const blueprintBtn = document.getElementById('btn-blueprint-toggle');
  const blueprintBadge = document.getElementById('blueprint-status-badge');

  if (blueprintBtn) {
    blueprintBtn.addEventListener('click', () => {
      haptics.playClick(1100, 'sawtooth', 0.08);
      blueprintBtn.classList.toggle('active');
      const isXRay = blueprintBtn.classList.contains('active');
      showroom.toggleXRayMode(isXRay);

      if (blueprintBadge) {
        blueprintBadge.style.display = isXRay ? 'flex' : 'none';
      }
      showToast(isXRay ? 'Architectural Blueprint Wireframe Active' : 'Photorealistic PBR Mode Restored');
    });
  }

  // --------------------------------------------------------------------------
  // 5. DRONE FLY-THROUGH TOUR TOGGLE
  // --------------------------------------------------------------------------
  const droneTourBtn = document.getElementById('btn-drone-tour');
  if (droneTourBtn) {
    droneTourBtn.addEventListener('click', () => {
      haptics.playClick(600);
      droneTourBtn.classList.toggle('active');
      showroom.isTourActive = droneTourBtn.classList.contains('active');
      showToast(showroom.isTourActive ? 'Cinematic Drone Walkthrough Started' : 'Manual Camera Control Resumed');
    });
  }

  // --------------------------------------------------------------------------
  // 6. OBJECT INSPECTION HUD (Triggered on 3D Object Click)
  // --------------------------------------------------------------------------
  const inspectorDrawer = document.getElementById('object-inspector-drawer');
  const inspectorTitle = document.getElementById('inspector-obj-title');
  const inspectorCategory = document.getElementById('inspector-obj-category');
  const closeInspectorBtn = document.getElementById('btn-close-inspector');

  window.addEventListener('nilayaa:object-selected', (e) => {
    haptics.playChime();
    const { name, category } = e.detail;

    if (inspectorTitle) inspectorTitle.textContent = name;
    if (inspectorCategory) inspectorCategory.textContent = category;
    if (inspectorDrawer) {
      inspectorDrawer.classList.add('open');
    }
  });

  if (closeInspectorBtn && inspectorDrawer) {
    closeInspectorBtn.addEventListener('click', () => {
      haptics.playClick(400);
      inspectorDrawer.classList.remove('open');
    });
  }

  // Inspector Material Swatches
  const inspectorSwatches = document.querySelectorAll('[data-inspect-material]');
  inspectorSwatches.forEach(btn => {
    btn.addEventListener('click', () => {
      haptics.playClick(900);
      inspectorSwatches.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const matKey = btn.getAttribute('data-inspect-material');
      showroom.applyMaterialToObject(matKey);
      showToast(`Applied ${matKey.toUpperCase()} to ${inspectorTitle.textContent}`);
    });
  });

  // --------------------------------------------------------------------------
  // 7. KEYBOARD SHORTCUTS
  // --------------------------------------------------------------------------
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

    if (e.key === '1') {
      document.querySelector('[data-room-switch="living"]')?.click();
    } else if (e.key === '2') {
      document.querySelector('[data-room-switch="kitchen"]')?.click();
    } else if (e.key === '3') {
      document.querySelector('[data-room-switch="bedroom"]')?.click();
    } else if (e.key === '4') {
      document.querySelector('[data-room-switch="office"]')?.click();
    } else if (e.key.toLowerCase() === 'x') {
      blueprintBtn?.click();
    } else if (e.key.toLowerCase() === 't') {
      droneTourBtn?.click();
    } else if (e.key === 'Escape') {
      inspectorDrawer?.classList.remove('open');
    }
  });

  // --------------------------------------------------------------------------
  // 8. TOAST NOTIFICATION HELPER
  // --------------------------------------------------------------------------
  function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = '0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2200);
  }

  window.showToast = showToast;
});
