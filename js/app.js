/**
 * NILAYAA INTERIORS — MAIN APP
 * Photo-based hero slider, sticky gallery scroll, accordions,
 * before/after slider, portfolio filters, calculator, testimonials, forms.
 * Three.js only loaded on-demand for the 3D configurator.
 */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ================================================================
// MARQUEE BUILD
// ================================================================
(function buildMarquee() {
  const items = [
    'Italian Calacatta Marble', 'Smoked Chevron Oak', 'Brushed Champagne Brass',
    'German Blum Hardware', '10-Year Structural Warranty',
    'Turnkey 45-Day Handover', '3D Spatial Digital Twins', 'KNX Smart Home Control'
  ];
  const inner = document.getElementById('marquee-inner');
  if (!inner) return;
  let html = '';
  items.forEach((txt, idx) => {
    const isLast = idx === items.length - 1;
    html += `<div class="marquee-item">${txt}${isLast ? '' : '<span class="marquee-sep"></span>'}</div>`;
  });
  inner.innerHTML = html;
})();

// ================================================================
// PRELOADER
// ================================================================
(function initPreloader() {
  const el = document.getElementById('preloader');
  const fill = document.getElementById('pre-fill');
  const label = document.getElementById('pre-label');
  if (!el) return;

  let pct = 0;
  const iv = setInterval(() => {
    pct = Math.min(100, pct + Math.random() * 22);
    const p = Math.floor(pct);
    fill.style.left = `${p - 100}%`;
    label.textContent = `Crafting your experience — ${p}%`;
    if (pct >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        gsap.to(el, { opacity: 0, duration: 0.7, onComplete: () => { el.style.display = 'none'; initEntryAnims(); } });
      }, 300);
    }
  }, 70);
})();

function initEntryAnims() {
  // Hero text & buttons remain 100% solid and permanently visible on screen without vanishing
}

// ================================================================
// MOBILE MENU
// ================================================================
const hambBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');
hambBtn?.addEventListener('click', () => mobileMenu.classList.toggle('open'));
document.querySelectorAll('.mob-link').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

// ================================================================
// HERO PHOTO BACKGROUND SLIDER (Dual-layer seamless crossfade)
// ================================================================
const HERO_PHOTOS = [
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80'
];

// Preload all photos into memory immediately
HERO_PHOTOS.forEach(src => { const img = new Image(); img.src = src; });

const bg1 = document.getElementById('hero-bg-1');
const bg2 = document.getElementById('hero-bg-2');
const heroDots = document.querySelectorAll('.slide-dot');
const heroStatN = document.getElementById('hero-stat-n');
const heroStatL = document.getElementById('hero-stat-l');

const ROOM_DATA = [
  { word: 'sanctuary', n: '450+', l: 'Luxury Projects' },
  { word: 'artistry',  n: '15+',  l: 'Years of Craft' },
  { word: 'serenity',  n: '4.9★', l: 'Google Rating' },
  { word: 'clarity',   n: '100%', l: 'On-Time Delivery' },
];

let currentPhotoIdx = 0;
let activeBgLayer = 1;
let autoPhotoTimer = null;

function cycleHeroPhoto(nextIdx) {
  currentPhotoIdx = (nextIdx + HERO_PHOTOS.length) % HERO_PHOTOS.length;
  const nextUrl = HERO_PHOTOS[currentPhotoIdx];

  if (activeBgLayer === 1) {
    if (bg2) {
      bg2.style.backgroundImage = `url('${nextUrl}')`;
      bg2.style.opacity = '1';
    }
    if (bg1) bg1.style.opacity = '0';
    activeBgLayer = 2;
  } else {
    if (bg1) {
      bg1.style.backgroundImage = `url('${nextUrl}')`;
      bg1.style.opacity = '1';
    }
    if (bg2) bg2.style.opacity = '0';
    activeBgLayer = 1;
  }

  // Update dots & stats
  heroDots.forEach((d, i) => d.classList.toggle('active', i === currentPhotoIdx));
  const rd = ROOM_DATA[currentPhotoIdx];
  if (heroStatN) heroStatN.textContent = rd.n;
  if (heroStatL) heroStatL.textContent = rd.l;
}

function startPhotoLoop() {
  clearInterval(autoPhotoTimer);
  autoPhotoTimer = setInterval(() => {
    cycleHeroPhoto(currentPhotoIdx + 1);
  }, 6000);
}

heroDots.forEach(dot => {
  dot.addEventListener('click', () => {
    cycleHeroPhoto(parseInt(dot.dataset.slide));
    startPhotoLoop();
  });
});

startPhotoLoop();

// ================================================================
// GALLERY — STICKY HORIZONTAL SCROLL (CSS translateX, no WebGL)
// Gallery vertical showcase — normal scroll flow

// ================================================================
// 3D CONFIGURATOR — ON-DEMAND (lazy init)
// ================================================================
let configurator = null;
let is3DMode = false;
let isXRay = false;

const btn3DToggle = document.getElementById('btn-3d-toggle');
const btnXRayToggle = document.getElementById('btn-xray-toggle');
const cfgWrap = document.getElementById('configurator-canvas-wrap');
const xrayPill = document.getElementById('xray-pill');
const xrayPill2 = document.getElementById('xray-pill-2');

btn3DToggle?.addEventListener('click', () => {
  is3DMode = !is3DMode;
  btn3DToggle.textContent = is3DMode ? '⬡ Exit 3D Mode' : '⬡ Enter 3D Mode';
  btn3DToggle.classList.toggle('active', is3DMode);
  cfgWrap?.classList.toggle('visible', is3DMode);

  if (is3DMode && !configurator) {
    // Lazy-load the 3D engine only now
    configurator = new NilayaaConfigurator('configurator-canvas');
    showToast('3D Mode Active — Drag to orbit, scroll to zoom');
  } else if (!is3DMode) {
    showToast('Returned to photo view');
  }
});

btnXRayToggle?.addEventListener('click', () => {
  isXRay = !isXRay;
  btnXRayToggle.classList.toggle('xray-active', isXRay);
  xrayPill?.classList.toggle('on', isXRay);
  xrayPill2?.classList.toggle('on', isXRay);

  if (configurator) {
    configurator.toggleXRay(isXRay);
  } else if (!is3DMode && isXRay) {
    // Auto-enable 3D mode if blueprint is toggled
    btn3DToggle?.click();
    setTimeout(() => configurator?.toggleXRay(true), 600);
  }
  showToast(isXRay ? 'Blueprint Wireframe Mode' : 'Photorealistic Mode');
});

// Lighting buttons (affect photo overlay brightness + 3D if active)
document.querySelectorAll('[data-light]').forEach(btn => {
  btn.addEventListener('click', () => {
    const row = btn.closest('.hud-row');
    if (row) row.querySelectorAll('[data-light]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const mode = btn.dataset.light;
    if (configurator) configurator.setLighting(mode);

    // Photo overlay tint for current panel
    const panel = btn.closest('.gallery-panel');
    if (panel) {
      const img = panel.querySelector('.gallery-panel-img');
      if (img) {
        if (mode === 'day') { img.style.filter = ''; }
        else if (mode === 'sunset') { img.style.filter = 'sepia(0.45) saturate(1.4) brightness(0.85)'; }
        else if (mode === 'night') { img.style.filter = 'brightness(0.35) saturate(0.6)'; }
      }
    }
    showToast(`Lighting → ${mode.charAt(0).toUpperCase() + mode.slice(1)}`);
  });
});

// ================================================================
// SERVICES ACCORDION
// ================================================================
document.querySelectorAll('.acc-item').forEach(item => {
  const header = item.querySelector('.acc-header');
  const body = item.querySelector('.acc-body');

  header?.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.acc-item').forEach(i => {
      i.classList.remove('open');
      const b = i.querySelector('.acc-body');
      if (b) b.style.maxHeight = '0';
    });
    if (!isOpen) {
      item.classList.add('open');
      body.style.maxHeight = (body.scrollHeight + 100) + 'px';
    }
  });
});

// Open first
setTimeout(() => document.querySelector('.acc-header')?.click(), 500);

// ================================================================
// BEFORE / AFTER SLIDER
// ================================================================
(function initBA() {
  const slider = document.getElementById('ba-slider');
  if (!slider) return;
  const after = document.getElementById('ba-after');
  const line = document.getElementById('ba-line');
  const handleBtn = slider.querySelector('.ba-handle-btn');
  let dragging = false;

  function setPos(clientX) {
    const rect = slider.getBoundingClientRect();
    const pct = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    after.style.width = pct + '%';
    line.style.left = pct + '%';
    if (handleBtn) handleBtn.style.left = pct + '%';
  }

  slider.addEventListener('mousedown', e => { e.preventDefault(); dragging = true; setPos(e.clientX); });
  window.addEventListener('mousemove', e => { if (dragging) setPos(e.clientX); });
  window.addEventListener('mouseup', () => { dragging = false; });
  slider.addEventListener('touchstart', e => { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchmove', e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend', () => { dragging = false; });
})();

// ================================================================
// PORTFOLIO FILTERS
// ================================================================
const pfBtns = document.querySelectorAll('.pf-btn');
const pmItems = document.querySelectorAll('.pm');

pfBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    pfBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    pmItems.forEach(item => {
      const show = filter === 'all' || item.dataset.cat === filter;
      gsap.to(item, { opacity: show ? 1 : 0.12, scale: show ? 1 : 0.97, duration: 0.4, ease: 'power2.out' });
    });
  });
});

// ================================================================
// CALCULATOR
// ================================================================
(function initCalc() {
  const PROP_BASE   = { '2bhk': 8, '3bhk': 14, '4bhk': 24, villa: 40 };
  const STYLE_MULT  = { basic: 1.0, luxury: 1.85, ultra: 2.65 };

  let propKey   = '3bhk';
  let styleKey  = 'luxury';
  let area      = 1850;
  let addonTotal = 4.5 + 3.2 + 1.8; // default checked

  function recalc() {
    const base = (PROP_BASE[propKey] || 14) * (area / 1200) * (STYLE_MULT[styleKey] || 1.85);
    const total = base + addonTotal;

    const lo = Math.round(8 + addonTotal * 0.6);
    const hi = Math.round(lo * 1.32);

    const el = document.getElementById('c-result');
    const tl = document.getElementById('c-timeline');
    if (el) el.textContent = `₹${total.toFixed(2)} Lakhs`;
    if (tl) tl.textContent = `Delivery: ${lo}–${hi} weeks · 10-Year Structural Warranty`;
  }

  // Property
  document.querySelectorAll('[data-prop]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-prop]').forEach(b => b.classList.remove('sel'));
      btn.classList.add('sel');
      propKey = btn.dataset.prop;
      recalc();
    });
  });

  // Style
  document.querySelectorAll('[data-style]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-style]').forEach(b => b.classList.remove('sel'));
      btn.classList.add('sel');
      styleKey = btn.dataset.style;
      recalc();
    });
  });

  // Area slider
  const areaSlider = document.getElementById('c-area');
  const areaVal = document.getElementById('c-area-val');
  if (areaSlider) {
    areaSlider.addEventListener('input', () => {
      area = parseInt(areaSlider.value);
      if (areaVal) areaVal.textContent = area.toLocaleString('en-IN') + ' sq.ft';
      recalc();
    });
  }

  // Addon rows
  document.querySelectorAll('.addon-row').forEach(row => {
    const box = row.querySelector('.addon-box');
    const cost = parseFloat(row.dataset.cost || 0);

    row.addEventListener('click', () => {
      const wasOn = box.classList.contains('on');
      box.classList.toggle('on', !wasOn);
      addonTotal += wasOn ? -cost : cost;
      if (addonTotal < 0) addonTotal = 0;
      recalc();
    });
  });

  // Lock & scroll
  recalc();
})();

// ================================================================
// TESTIMONIAL CAROUSEL
// ================================================================
(function initTesti() {
  const track = document.getElementById('testi-track');
  if (!track) return;
  const slides = track.querySelectorAll('.testi-slide');
  const n = slides.length;
  let current = 0;

  function goTo(idx) {
    current = (idx + n) % n;
    gsap.to(track, { x: `-${current * 100}%`, duration: 0.75, ease: 'power3.inOut' });
  }

  document.getElementById('testi-prev')?.addEventListener('click', () => goTo(current - 1));
  document.getElementById('testi-next')?.addEventListener('click', () => goTo(current + 1));
  setInterval(() => goTo(current + 1), 6800);
})();

// ================================================================
// FORM SUBMIT
// ================================================================
document.getElementById('consultation-form')?.addEventListener('submit', e => {
  e.preventDefault();
  showToast('Request sent! Our architect will contact you within 2 hours.');
  e.target.reset();
});

// ================================================================
// TOAST
// ================================================================
function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  container.appendChild(t);

  setTimeout(() => {
    gsap.to(t, { opacity: 0, x: 20, duration: 0.35, onComplete: () => t.remove() });
  }, 2800);
}

window.showToast = showToast;
