// ── IMAGE DATA ──────────────────────────────────────────────────────────────
const PROJECTS = {
  tm: {
    mainId: 'tm-main',
    galleryId: 'tm-gallery',
    counterId: 'tm-counter',
    images: [
      'images/telecom/slide_01.png',
      'images/telecom/slide_02.png',
      'images/telecom/slide_03.png',
      'images/telecom/slide_04.png',
      'images/telecom/slide_05.png',
      'images/telecom/slide_06.png',
      'images/telecom/slide_07.png',
      'images/telecom/slide_08.png',
      'images/telecom/slide_09.png',
      'images/telecom/slide_10.png',
      'images/telecom/1.png',
      'images/telecom/2.png',
      'images/telecom/3.png',
      'images/telecom/4.png',
      'images/telecom/5.png',
      'images/telecom/6.png',
    ]
  },
  ns: {
    mainId: 'ns-main',
    galleryId: 'ns-gallery',
    counterId: 'ns-counter',
    images: [
      'images/neuroscan/slide_01.png',
      'images/neuroscan/slide_02.png',
      'images/neuroscan/slide_03.png',
      'images/neuroscan/slide_04.png',
      'images/neuroscan/slide_05.png',
      'images/neuroscan/slide_06.png',
      'images/neuroscan/slide_07.png',
      'images/neuroscan/slide_08.png',
      'images/neuroscan/slide_09.png',
      'images/neuroscan/slide_10.png',
      'images/neuroscan/slide_11.png',
      'images/neuroscan/slide_12.png',
      'images/neuroscan/1.png',
      'images/neuroscan/2.png',
      'images/neuroscan/3.png',
      'images/neuroscan/4.png',
    ]
  },
  sh: {
    mainId: 'sh-main',
    galleryId: 'sh-gallery',
    counterId: 'sh-counter',
    images: [
      'images/shopping/slide_01.png',
      'images/shopping/slide_02.png',
      'images/shopping/slide_03.png',
      'images/shopping/slide_04.png',
      'images/shopping/slide_05.png',
      'images/shopping/slide_06.png',
      'images/shopping/slide_07.png',
      'images/shopping/slide_08.png',
      'images/shopping/slide_09.png',
      'images/shopping/slide_10.png',
      'images/shopping/slide_11.png',
      'images/shopping/slide_12.png',
      'images/shopping/slide_13.png',
      'images/shopping/slide_14.png',
      'images/shopping/slide_15.png',
      'images/shopping/slide_16.png',
      'images/shopping/1.png',
      'images/shopping/2.png',
      'images/shopping/3.png',
    ]
  }
};

// current index & page for each project
const state = { tm: 0, ns: 0, sh: 0 };
const THUMB_PAGE_SIZE = 4;

// ── INIT GALLERIES ──────────────────────────────────────────────────────────
function initGallery(key) {
  const proj = PROJECTS[key];
  const gallery = document.getElementById(proj.galleryId);
  if (!gallery) return;

  // render all thumbs
  proj.images.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Image ${i + 1}`;
    img.loading = 'lazy';
    if (i === 0) img.classList.add('active');
    img.onclick = () => selectImg(key, i);
    gallery.appendChild(img);
  });

  updateCounter(key);
  showThumbPage(key, 0);
}

function showThumbPage(key, startIdx) {
  const proj = PROJECTS[key];
  const gallery = document.getElementById(proj.galleryId);
  const thumbs = gallery.querySelectorAll('img');
  thumbs.forEach((t, i) => {
    t.style.display = (i >= startIdx && i < startIdx + THUMB_PAGE_SIZE) ? 'block' : 'none';
  });
}

function selectImg(key, idx) {
  const proj = PROJECTS[key];
  state[key] = idx;

  // update main image
  document.getElementById(proj.mainId).src = proj.images[idx];

  // update active thumb
  const gallery = document.getElementById(proj.galleryId);
  gallery.querySelectorAll('img').forEach((t, i) => {
    t.classList.toggle('active', i === idx);
  });

  // scroll thumb page to show active
  const page = Math.floor(idx / THUMB_PAGE_SIZE) * THUMB_PAGE_SIZE;
  showThumbPage(key, page);

  updateCounter(key);
}

function nextSlide(key) {
  const proj = PROJECTS[key];
  const next = (state[key] + 1) % proj.images.length;
  selectImg(key, next);
}

function prevSlide(key) {
  const proj = PROJECTS[key];
  const prev = (state[key] - 1 + proj.images.length) % proj.images.length;
  selectImg(key, prev);
}

function updateCounter(key) {
  const proj = PROJECTS[key];
  const el = document.getElementById(proj.counterId);
  if (el) el.textContent = `${state[key] + 1} / ${proj.images.length}`;
}

// ── MODAL ────────────────────────────────────────────────────────────────────
function openModal(src) {
  document.getElementById('modal-img').src = src;
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

document.querySelector('.modal-close')?.addEventListener('click', closeModal);

// ── ANIMATED PARTICLE BACKGROUND ─────────────────────────────────────────────
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = (Math.random() - 0.5) * 0.25;
    this.r = Math.random() * 1.5 + 0.3;
    this.alpha = Math.random() * 0.4 + 0.1;
    this.color = Math.random() > 0.65 ? '#0d9488' : '#3b82f6';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
  }
}

for (let i = 0; i < 100; i++) particles.push(new Particle());

function animBG() {
  ctx.clearRect(0, 0, W, H);
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 130) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = '#0d9488';
        ctx.globalAlpha = (1 - d / 130) * 0.06;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  particles.forEach(p => { p.update(); p.draw(); });
  ctx.globalAlpha = 1;
  requestAnimationFrame(animBG);
}
animBG();

// ── SCROLL ANIMATIONS ─────────────────────────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-left').forEach(el => revealObs.observe(el));

// ── COUNTER ANIMATION ─────────────────────────────────────────────────────────
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseInt(el.dataset.target);
      let current = 0;
      const step = target / 40;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.round(current);
        if (current >= target) clearInterval(timer);
      }, 40);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

// ── NAV SCROLL EFFECT ─────────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 60);
});

// ── MOBILE MENU ───────────────────────────────────────────────────────────────
function toggleMenu() {
  document.getElementById('mobile-menu')?.classList.toggle('open');
}

// ── SMOOTH SCROLL ─────────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  });
});

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initGallery('tm');
  initGallery('ns');
  initGallery('sh');
});
