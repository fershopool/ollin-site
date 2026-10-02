import { $, $$ } from '../utils/dom.js';

// Dinamismo de scroll y puntero. Todo vive bajo `html.motion`: sin JS o con movimiento reducido, el sitio queda estático.
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

function markReveal() {
  const mark = (node, i = 0) => { if (!node) return; node.classList.add('reveal'); node.style.setProperty('--i', i % 4); };
  $$('main .section > .container').forEach((container) => [...container.children].forEach((child) => {
    if (child.matches('.grid, .tech-grid, .contrast-cards, .profile-list')) [...child.children].forEach(mark);
    else if (child.classList.contains('participation')) { [...$('.profile-list', child).children].forEach(mark); mark($('.prose', child), 2); }
    else mark(child);
  }));
}

function splitHeroTitle() {
  const title = $('.hero-copy h1');
  if (!title) return;
  const words = title.textContent.trim().split(/\s+/);
  title.replaceChildren(...words.flatMap((word, i) => {
    const span = document.createElement('span');
    span.className = 'word'; span.textContent = word; span.style.setProperty('--w', i);
    return i ? [' ', span] : [span];
  }));
}

function setupTilt() {
  $$('.project-card, .principle-card, .impact-card, .article-card, .tech-card, .contrast-card').forEach((card) => {
    card.classList.add('tilt');
    card.addEventListener('pointermove', (event) => {
      const box = card.getBoundingClientRect(); const x = (event.clientX - box.left) / box.width; const y = (event.clientY - box.top) / box.height;
      card.style.setProperty('--ry', `${((x - .5) * 8).toFixed(2)}deg`); card.style.setProperty('--rx', `${((.5 - y) * 8).toFixed(2)}deg`);
      card.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`); card.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
    });
    card.addEventListener('pointerleave', () => { card.style.removeProperty('--rx'); card.style.removeProperty('--ry'); });
  });
}

export function initMotion() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const root = document.documentElement; root.classList.add('motion');
  const hero = $('.hero--cover'); const header = $('.site-header--hero'); const track = $('.codex-track');
  const parallax = [$('.section.dark'), $('#sobre-ollin'), $('.ecosystem-visual')].filter(Boolean);
  parallax.forEach((node) => node.setAttribute('data-sp', ''));

  markReveal(); splitHeroTitle();
  $$('.section-heading .eyebrow').forEach((node) => node.classList.add('glyph'));
  const seen = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('in'); seen.unobserve(entry.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal, main > section:not(.hero)').forEach((node) => seen.observe(node));

  let lastY = scrollY; let ticking = false; let boost = 0; let boosting = false;
  // El loop de códices se acelera con la velocidad de scroll y vuelve a su ritmo solo.
  function easeTrack() {
    boost *= .93; const animation = track?.getAnimations()[0];
    if (animation) animation.updatePlaybackRate(1 + boost);
    if (boost > .02) requestAnimationFrame(easeTrack); else { boosting = false; animation?.updatePlaybackRate(1); }
  }
  function frame() {
    ticking = false; const y = scrollY; const vh = innerHeight; const max = root.scrollHeight - vh; const dy = y - lastY;
    root.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    if (hero) hero.style.setProperty('--hp', clamp(y / hero.offsetHeight).toFixed(3));
    parallax.forEach((node) => { const box = node.getBoundingClientRect(); if (box.bottom > -100 && box.top < vh + 100) node.style.setProperty('--sp', clamp((vh - box.top) / (vh + box.height)).toFixed(3)); });
    if (header && hero) {
      const pinned = y > hero.offsetHeight - 120; header.classList.toggle('is-pinned', pinned);
      if (!pinned || dy < -4 || $('.mobile-drawer.open', header)) header.classList.remove('is-hidden'); else if (dy > 4) header.classList.add('is-hidden');
    }
    boost = Math.min(4, boost + Math.abs(dy) / 40); if (!boosting && track) { boosting = true; requestAnimationFrame(easeTrack); }
    lastY = y;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  frame();

  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  setupTilt();
  if (hero) hero.addEventListener('pointermove', (event) => {
    hero.style.setProperty('--mx', (event.clientX / innerWidth - .5).toFixed(3)); hero.style.setProperty('--my', (event.clientY / innerHeight - .5).toFixed(3));
  });
}
