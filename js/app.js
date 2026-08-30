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
// HEADER SCROLL
// ================================================================
const siteHeader = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  siteHeader.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ================================================================
// MOBILE MENU
// ================================================================
const hambBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');
hambBtn?.addEventListener('click', () => mobileMenu.classList.toggle('open'));
document.querySelectorAll('.mob-link').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

// ================================================================
// HERO PHOTO SLIDER (CSS transitions only — no WebGL)
// ================================================================
const heroSlides = document.querySelectorAll('.hero-slide');
const heroSlidesWrap = document.getElementById('hero-slides');
const heroDots = document.querySelectorAll('.slide-dot');
const heroWord = document.getElementById('hero-word');
const heroStatN = document.getElementById('hero-stat-n');
const heroStatL = document.getElementById('hero-stat-l');

const ROOM_DATA = [
  { word: 'sanctuary', n: '450+', l: 'Luxury Projects' },
  { word: 'artistry',  n: '15+',  l: 'Years of Craft' },
  { word: 'serenity',  n: '4.9★', l: 'Google Rating' },
  { word: 'clarity',   n: '100%', l: 'On-Time Delivery' },
];

let currentSlide = 0;
let autoSlideTimer = null;

function goToSlide(idx) {
  currentSlide = idx;
  // Translate slides strip
  heroSlidesWrap.style.transform = `translateX(-${idx * 100}vw)`;

  // Mark active for ken-burns
  heroSlides.forEach((s, i) => s.classList.toggle('active', i === idx));

  // Dots
  heroDots.forEach((d, i) => d.classList.toggle('active', i === idx));

  // Update stats without fading title text
  const rd = ROOM_DATA[idx];
  if (heroStatN) heroStatN.textContent = rd.n;
  if (heroStatL) heroStatL.textContent = rd.l;
}

function startAutoSlide() {
  clearInterval(autoSlideTimer);
  autoSlideTimer = setInterval(() => {
    goToSlide((currentSlide + 1) % heroSlides.length);
  }, 6000);
}

heroDots.forEach(dot => {
  dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.dataset.slide));
    startAutoSlide();
  });
});

// Touch swipe on hero
let heroTouchX = 0;
const heroEl = document.getElementById('hero');
heroEl?.addEventListener('touchstart', e => { heroTouchX = e.touches[0].clientX; }, { passive: true });
heroEl?.addEventListener('touchend', e => {
  const diff = heroTouchX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    goToSlide(diff > 0 ? (currentSlide + 1) % heroSlides.length : (currentSlide - 1 + heroSlides.length) % heroSlides.length);
    startAutoSlide();
  }
}, { passive: true });

startAutoSlide();

// ================================================================
// GALLERY — STICKY HORIZONTAL SCROLL (CSS translateX, no WebGL)
// ================================================================
const gallerySection = document.getElementById('gallery-section');
const galleryTrack = document.getElementById('gallery-track');
const galProgressFill = document.getElementById('gallery-prog-fill');
const galCounter = document.getElementById('gallery-counter');
const galActiveName = document.getElementById('gallery-active-name');

const GALLERY_NAMES = [
  'Living Lounge Pavilion',
  'Gourmet Kitchen Island',
  'Master Penthouse Suite',
  'Executive Office Library',
];

let lastGalRoom = -1;

ScrollTrigger.create({
  trigger: gallerySection,
  start: 'top top',
  end: 'bottom bottom',
  pin: '#gallery-sticky',
  scrub: true,
  onUpdate: self => {
    const prog = self.progress;
    const n = GALLERY_NAMES.length;
    const room = Math.min(Math.floor(prog * n), n - 1);
    const tx = -prog * (100 * (n - 1));

    galleryTrack.style.transform = `translateX(${tx}vw)`;
    galProgressFill.style.width = `${Math.round(prog * 100)}%`;
    galCounter.textContent = `0${room + 1} / 0${n}`;

    if (room !== lastGalRoom) {
      lastGalRoom = room;
      gsap.to(galActiveName, {
        opacity: 0, y: -6, duration: 0.2,
        onComplete: () => {
          galActiveName.textContent = GALLERY_NAMES[room];
          gsap.to(galActiveName, { opacity: 1, y: 0, duration: 0.3 });
        }
      });
    }
  }
});

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

  slider.addEventListener('mousedown', e => { dragging = true; setPos(e.clientX); });
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
  document.getElementById('btn-lock')?.addEventListener('click', () => {
    gsap.to(window, { scrollTo: '#contact-section', duration: 1.2, ease: 'power3.inOut' });
    showToast('Redirecting to booking form…');
  });

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
// GSAP SCROLL ANIMATIONS
// ================================================================
// Fade-up elements
gsap.utils.toArray('.fact-cell, .proc-step').forEach((el, i) => {
  gsap.from(el, {
    opacity: 0, y: 36, duration: 0.9,
    delay: (i % 4) * 0.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
  });
});

gsap.utils.toArray('.m-body, .manifesto-sidebar').forEach(el => {
  gsap.from(el, {
    opacity: 0, y: 40, duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 85%' }
  });
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
