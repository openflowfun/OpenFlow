import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { createScene } from './scene.js';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (reduced) document.documentElement.classList.add('reduced');
$('#year').textContent = new Date().getFullYear();

/* ---------------- WebGL ---------------- */
const scene = createScene($('#gl'));

/* ---------------- Smooth scroll ---------------- */
const lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: !reduced });
lenis.stop();
lenis.on('scroll', (e) => { ScrollTrigger.update(); scene?.setVelocity(e.velocity * 60); });
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

$$('a[href^="#"]').forEach(a => a.addEventListener('click', (e) => {
  const id = a.getAttribute('href');
  if (id.length < 2) return;
  const el = $(id);
  if (!el) return;
  e.preventDefault();
  document.body.classList.remove('menu-open');
  $('#burger')?.setAttribute('aria-expanded', 'false');
  lenis.start();
  lenis.scrollTo(el, { offset: id === '#top' ? 0 : -20, duration: 1.6 });
}));

/* ---------------- Preloader ---------------- */
function preload() {
  const bar = $('#loaderBar'), pct = $('#loaderPct');
  const imgs = ['/assets/flow/hero.webp', '/assets/logo-word.webp'];
  let done = 0; const total = imgs.length + 1;
  let shown = 0, target = 0;
  const tick = () => {
    shown += (target - shown) * 0.12;
    const v = Math.round(shown);
    bar.style.width = v + '%'; pct.textContent = String(v).padStart(3, '0');
    if (shown < 99.5) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  const step = () => { done++; target = (done / total) * 100; };
  const ps = imgs.map(src => new Promise(r => { const i = new Image(); i.onload = i.onerror = () => { step(); r(); }; i.src = src; }));
  ps.push(document.fonts.ready.then(step));
  const min = new Promise(r => setTimeout(r, 1100));
  const max = new Promise(r => setTimeout(r, 4500));
  return Promise.race([Promise.all([...ps, min]), max]).then(() => { target = 100; return new Promise(r => setTimeout(r, 350)); });
}

preload().then(() => {
  $('#loader').classList.add('done');
  document.body.classList.remove('is-loading');
  lenis.start();
  intro();
  setTimeout(() => $('#loader')?.remove(), 1400);
});

/* ---------------- Hero intro ---------------- */
function intro() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.hero__title .word', { yPercent: 115, rotate: 4, duration: 1.4, stagger: 0.06 }, 0.15)
    .to('.hero .reveal-up', { opacity: 1, y: 0, duration: 1.2, stagger: 0.1 }, 0.5)
    .from('.hero__flow', { opacity: 0, scale: 0.85, y: 60, filter: 'blur(20px)', duration: 1.8 }, 0.2)
    .from('.hero__visual .chip', { opacity: 0, scale: 0.6, y: 20, stagger: 0.12, duration: 1, ease: 'back.out(2)' }, 0.9)
    .from('.orbit', { opacity: 0, scale: 0.7, stagger: 0.1, duration: 1.6 }, 0.3)
    .from('.nav', { y: -40, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.4);
  countUp($$('.hero [data-count]'));
}

function countUp(els) {
  els.forEach(el => {
    const end = +el.dataset.count, suf = el.dataset.suffix || '';
    const o = { v: 0 };
    gsap.to(o, { v: end, duration: 2, ease: 'power3.out', delay: 0.6, onUpdate: () => { el.textContent = Math.round(o.v) + suf; } });
  });
}

/* ---------------- Scene choreography ---------------- */
const SCENES = {
  0: { shape: 0, offsetX: 2.6, tilt: 0.35, fade: 1 },
  1: { shape: 1, offsetX: 0, tilt: 0.1, fade: 0.75 },
  2: { shape: 2, offsetX: 3.2, tilt: 0.2, fade: 0.85 },
  3: { shape: 3, offsetX: 0, tilt: 0.25, fade: 0.9 },
  4: { shape: 1, offsetX: 0, tilt: 0, fade: 0.35 },
  5: { shape: 4, offsetX: 3, tilt: 0.9, fade: 0.7 },
  6: { shape: 2, offsetX: -3, tilt: 0.2, fade: 0.9 },
  7: { shape: 4, offsetX: 0, tilt: 1.2, fade: 0.8 },
  8: { shape: 0, offsetX: -2.4, tilt: 0.5, fade: 0.9 }
};
if (scene) {
  $$('[data-scene]').forEach(sec => {
    const cfg = SCENES[sec.dataset.scene];
    ScrollTrigger.create({
      trigger: sec, start: 'top 55%', end: 'bottom 45%',
      onEnter: () => scene.setShape(cfg.shape, cfg),
      onEnterBack: () => scene.setShape(cfg.shape, cfg)
    });
  });
  if (finePointer) {
    window.addEventListener('pointermove', (e) => {
      scene.setMouse((e.clientX / innerWidth - 0.5) * 2, -(e.clientY / innerHeight - 0.5) * 2);
    }, { passive: true });
  }
}

/* ---------------- Nav behaviour ---------------- */
const nav = $('#nav');
let lastY = 0;
lenis.on('scroll', ({ scroll }) => {
  nav.classList.toggle('scrolled', scroll > 40);
  if (!document.body.classList.contains('menu-open')) nav.classList.toggle('hide', scroll > lastY && scroll > 500);
  lastY = scroll;
});
const navLinks = $$('.nav__links a');
navLinks.forEach(a => {
  const sec = $(a.getAttribute('href'));
  if (!sec) return;
  ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: s => a.classList.toggle('active', s.isActive) });
});
$('#burger').addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  $('#burger').setAttribute('aria-expanded', String(open));
  $('#menu').setAttribute('aria-hidden', String(!open));
  open ? lenis.stop() : lenis.start();
  if (open) gsap.from('.menu__links a', { y: 60, opacity: 0, stagger: 0.06, duration: 0.9, ease: 'expo.out', delay: 0.15 });
});

/* ---------------- Generic reveals ---------------- */
ScrollTrigger.batch('.reveal-up:not(.hero .reveal-up)', {
  start: 'top 88%',
  onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1.1, stagger: 0.1, ease: 'expo.out' })
});
$$('.kicker, .h2, .h2--sm').forEach(el => {
  if (el.closest('.hero')) return;
  gsap.from(el, { y: 50, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
});
gsap.utils.toArray('.leak, .why__item, .w3item').forEach((el, i) => {
  gsap.from(el, { y: 70, opacity: 0, rotateX: -12, duration: 1.2, ease: 'expo.out', delay: (i % 4) * 0.08, scrollTrigger: { trigger: el, start: 'top 90%' } });
});

/* scrub word highlight */
$$('[data-scrub-words]').forEach(el => {
  const walk = (node) => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
          else { const s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s); }
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
  };
  walk(el);
  const words = $$('.w', el);
  // emphasized wrapper words keep gradient: give their spans the class
  gsap.to(words, { opacity: 1, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 40%', scrub: 0.6 } });
});

/* ---------------- Marquees (velocity-reactive) ---------------- */
$$('[data-marquee]').forEach(track => {
  const dir = +(track.dataset.dir || -1) < 0 ? -1 : 1;
  const base = dir === 1 ? -50 : 0;
  gsap.set(track, { xPercent: base });
  let x = base;
  let speed = track.classList.contains('marquee__track') ? 0.035 : 0.025;
  gsap.ticker.add((t, dt) => {
    const boost = 1 + Math.min(Math.abs(lenis.velocity) * 0.08, 6);
    x += (dir === 1 ? 1 : -1) * speed * boost * (dt / 16.7);
    if (dir === -1 && x <= -50) x += 50;
    if (dir === 1 && x >= 0) x -= 50;
    gsap.set(track, { xPercent: x });
  });
});

/* ---------------- Responsive scroll scenes ---------------- */
const mm = gsap.matchMedia();
mm.add('(min-width: 1101px)', () => {
  // horizontal pillars
  const track = $('#pillarsTrack');
  const pin = $('.pillars__pin');
  const dist = () => track.scrollWidth - (pin.clientWidth - track.offsetLeft) + 40;
  const tween = gsap.to(track, {
    x: () => -dist(), ease: 'none',
    scrollTrigger: {
      trigger: '.pillars', start: 'top top', end: () => '+=' + dist(), pin: pin, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
      onUpdate: s => { $('#pillarsBar').style.width = (s.progress * 100) + '%'; }
    }
  });
  $$('.pillar', track).forEach(card => {
    gsap.from(card, { opacity: 0.25, scale: 0.92, rotateY: -14, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 95%', end: 'left 55%', scrub: true } });
  });

  // method: draw path + fly Flow along it + light steps
  const path = $('#flowPath');
  const len = path.getTotalLength();
  const flyer = $('#flyer');
  const svg = $('.method__path');
  const steps = $$('.step');
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
  ScrollTrigger.create({
    trigger: '.method', start: 'top top', end: '+=1600', pin: '.method__pin', scrub: 0.6, anticipatePin: 1,
    onUpdate: (s) => {
      const p = s.progress;
      path.style.strokeDashoffset = len * (1 - p);
      const pt = path.getPointAtLength(len * p);
      const pt2 = path.getPointAtLength(Math.min(len, len * p + 4));
      const box = svg.getBoundingClientRect();
      const sx = box.width / 1200, sy = box.height / 300;
      const ang = Math.atan2((pt2.y - pt.y) * sy, (pt2.x - pt.x) * sx) * 180 / Math.PI;
      gsap.set(flyer, { x: pt.x * sx, y: pt.y * sy, rotate: ang * 0.5, xPercent: -50, yPercent: -65 });
      steps.forEach((st, i) => st.classList.toggle('on', p >= i * 0.25 + 0.02));
    }
  });

  // gallery parallax
  $$('.gallery__col').forEach(col => {
    gsap.to(col, { yPercent: +col.dataset.speed * 100, ease: 'none', scrollTrigger: { trigger: '.gallery', start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  return () => {};
});
mm.add('(max-width: 1100px)', () => {
  const path = $('#flowPath');
  const len = path.getTotalLength();
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
  gsap.to(path, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.method', start: 'top 70%', end: 'center 40%', scrub: true } });
  gsap.set('#flyer', { x: '50%', left: '50%', top: '0%', xPercent: -50, yPercent: -70 });
  $$('.step').forEach(st => ScrollTrigger.create({ trigger: st, start: 'top 80%', onEnter: () => st.classList.add('on') }));
  $$('.pillar').forEach(card => gsap.from(card, { y: 60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 90%' } }));
});

/* case media scale-in */
$$('.case').forEach(c => {
  gsap.fromTo($('.case__media', c), { scale: 0.86, rotate: c.matches(':nth-child(even)') ? 2 : -2 }, { scale: 1, rotate: 0, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'center 55%', scrub: true } });
  gsap.from($$('.case__body > *', c), { y: 40, opacity: 0, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 75%' } });
});

/* hero visual parallax on scroll */
gsap.to('.hero__visual', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
gsap.to('.hero__copy', { yPercent: -10, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'center center', end: 'bottom top', scrub: true } });
gsap.from('.web3__visual img', { scale: 0.8, opacity: 0, rotate: -6, ease: 'none', scrollTrigger: { trigger: '.web3', start: 'top bottom', end: 'center center', scrub: true } });
gsap.from('.products__visual img', { x: 120, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.products', start: 'top bottom', end: 'center center', scrub: true } });
gsap.from('.contact__flow', { y: 80, opacity: 0, rotate: 6, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.contact', start: 'top 70%' } });
gsap.from('.footer__word', { yPercent: 40, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });

/* ---------------- Pointer FX (desktop) ---------------- */
if (finePointer && !reduced) {
  // cursor
  const cur = $('#cursor'), label = $('#cursorLabel');
  const xTo = gsap.quickTo(cur, 'x', { duration: 0.18, ease: 'power3' });
  const yTo = gsap.quickTo(cur, 'y', { duration: 0.18, ease: 'power3' });
  window.addEventListener('pointermove', e => { xTo(e.clientX); yTo(e.clientY); }, { passive: true });
  $$('a, button, [data-cursor], .chips label').forEach(el => {
    el.addEventListener('pointerenter', () => {
      cur.classList.add('is-hover');
      if (el.dataset.cursor) { label.textContent = el.dataset.cursor; cur.classList.add('has-label'); }
    });
    el.addEventListener('pointerleave', () => { cur.classList.remove('is-hover', 'has-label'); });
  });
  // magnetic
  $$('[data-magnetic]').forEach(el => {
    const mx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1,0.4)' });
    const my = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1,0.4)' });
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      mx((e.clientX - r.left - r.width / 2) * 0.3); my((e.clientY - r.top - r.height / 2) * 0.35);
    });
    el.addEventListener('pointerleave', () => { mx(0); my(0); });
  });
  // tilt
  $$('[data-tilt]').forEach(el => {
    const rx = gsap.quickTo(el, 'rotateX', { duration: 0.6, ease: 'power3' });
    const ry = gsap.quickTo(el, 'rotateY', { duration: 0.6, ease: 'power3' });
    gsap.set(el, { transformPerspective: 900 });
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 10); rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
    });
    el.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
  // hero mascot follows pointer slightly
  const hf = $('.hero__flow');
  const hx = gsap.quickTo(hf, 'x', { duration: 1.2, ease: 'power3' });
  const hr = gsap.quickTo(hf, 'rotateY', { duration: 1.2, ease: 'power3' });
  window.addEventListener('pointermove', e => { const n = e.clientX / innerWidth - 0.5; hx(n * 30); hr(n * 8); }, { passive: true });
}

/* ---------------- Contact form ---------------- */
const form = $('#contactForm');
const status = $('#formStatus');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.className = 'form__status'; status.textContent = '';
  let ok = true;
  ['name', 'email', 'message'].forEach(n => {
    const f = form.elements[n];
    const bad = !f.value.trim() || (n === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
    f.closest('.field').classList.toggle('invalid', bad);
    if (bad) ok = false;
  });
  if (!ok) { status.classList.add('err'); status.textContent = 'Please fill in your name, a valid email and a short message.'; return; }
  const fd = new FormData(form);
  const payload = {
    name: fd.get('name'), email: fd.get('email'), company: fd.get('company'), phone: fd.get('phone'),
    services: fd.getAll('services'), budget: fd.get('budget'), message: fd.get('message'), website: fd.get('website'),
    page: location.href
  };
  const btn = form.querySelector('button[type=submit]');
  const lbl = btn.querySelector('.btn__label');
  btn.disabled = true; lbl.textContent = 'Sending…';
  try {
    const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong');
    form.reset(); form.classList.add('sent');
    lbl.textContent = 'Received';
    status.classList.add('ok'); status.textContent = "Thanks! Flow has your message — we'll be in touch within one business day.";
    gsap.fromTo('.contact__flow', { rotate: 0 }, { rotate: 8, yoyo: true, repeat: 3, duration: 0.15 });
  } catch (err) {
    lbl.textContent = 'Send it to the flow';
    status.classList.add('err'); status.textContent = "Couldn't send right now — email us at openflow.fun@gmail.com.";
  } finally { btn.disabled = false; }
});

window.addEventListener('load', () => ScrollTrigger.refresh());
