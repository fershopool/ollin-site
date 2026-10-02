import { el } from '../utils/dom.js';
import { routes } from '../config/routes.js';

// Diagrama vivo del ecosistema. Coordenadas en un lienzo de 1000×620; el CSS lo escala.
const W = 1000, H = 620, CORE = [500, 300];
const TIERS = {
  projects: { label: 'Experiencias y proyectos', sub: 'Ideas que cobran vida', text: 'Cada proyecto puede crecer a su ritmo y conservar su voz, mientras se conecta con un marco común.', link: ['Ver proyectos', routes.proyectos] },
  capabilities: { label: 'Capacidades compartidas', sub: 'Herramientas que multiplican', text: 'Herramientas comunes que evitan repetir esfuerzos entre proyectos.' },
  principles: { label: 'Principios y base', sub: 'Valores que sostienen', text: 'Los valores que sostienen todo lo que OLLIN diseña y comunica.', link: ['Ver principios', routes.principios] },
};
// [tier, nombre, x, y, descripción, enlace?]
const NODES = [
  ['projects', 'Cuicoyan', 120, 110, 'Cultura en movimiento: eventos, artistas y espacios culturales.'],
  ['projects', 'UPIICSA Calpolli', 310, 100, 'Comunidad y colaboración dentro de UPIICSA.'],
  ['projects', 'Tlatolli', 500, 90, 'Marketing con identidad: estrategia, contenido y comunicación.'],
  ['projects', 'Yancuic Tech', 690, 100, 'Ideas en conversación sobre tecnología, cultura y comunidades. Próximamente.', ['Conocer Yancuic', routes.tlatolli]],
  ['projects', 'Futuras iniciativas', 880, 110, 'Nuevas ideas que pueden sumarse al ecosistema sin perder su propia voz.'],
  ['capabilities', 'Identidad y acceso', 250, 235, 'Formas claras y seguras de reconocer a las personas y dar acceso a cada experiencia.'],
  ['capabilities', 'Comunicación', 215, 305, 'Canales comunes para informar, avisar y conversar con las comunidades.'],
  ['capabilities', 'Mapas y territorio', 290, 375, 'Información geográfica que ayuda a ubicar lugares, eventos y servicios.'],
  ['capabilities', 'Datos con propósito', 750, 235, 'Se usan solo cuando aportan un valor claro a las personas.'],
  ['capabilities', 'Interoperabilidad', 785, 305, 'Estándares y conexiones que buscan evitar ecosistemas cerrados.'],
  ['capabilities', 'IA responsable', 710, 375, 'Inteligencia artificial aplicada cuando aporta valor comprensible y puede gobernarse.'],
  ['principles', 'Privacidad desde el diseño', 130, 510, 'Decisiones de producto que minimizan riesgos y dan claridad a las personas.'],
  ['principles', 'Seguridad', 280, 545, 'Proteger la información es una condición de base, no un añadido.'],
  ['principles', 'Estándares', 420, 575, 'Reglas y formatos compartidos para que los proyectos puedan colaborar.'],
  ['principles', 'Transparencia', 580, 575, 'Explicamos qué hacemos y por qué, en lenguaje comprensible.'],
  ['principles', 'Gobernanza', 720, 545, 'Criterios claros sobre cómo se decide y se rinde cuentas en el ecosistema.'],
  ['principles', 'Capacidad tecnológica mexicana', 870, 510, 'Conocimiento, infraestructura y soluciones desarrolladas desde México.'],
];
const TIER_LABEL_POS = { projects: [500, 18], capabilities: [40, 165], principles: [40, 415] };

const curve = (tier, x, y) => {
  const [cx, cy] = CORE, m = tier === 'capabilities' ? [(cx + x) / 2, cy, (cx + x) / 2, y] : [cx, (cy + y) / 2, x, (cy + y) / 2];
  return `M${cx} ${cy}C${m[0]} ${m[1]} ${m[2]} ${m[3]} ${x} ${y}`;
};
const pct = (x, y) => `left:${x / W * 100}%;top:${y / H * 100}%`;

export function createEcosystemDiagram() {
  const root = el('figure', { className: 'ecosystem-visual eco', attrs: { 'data-tier': 'all', 'aria-label': 'Diagrama interactivo del ecosistema OLLIN' } });
  const lines = NODES.map(([tier, , x, y]) => `<path class="eco-line" data-tier="${tier}" d="${curve(tier, x, y)}"/>`).join('');
  const svg = el('div', { className: 'eco-lines', attrs: { 'aria-hidden': 'true' }, innerHTML: `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${lines}</svg>` });
  const paths = [...svg.querySelectorAll('path')];

  const tierEls = Object.entries(TIERS).map(([id, t]) => el('div', { className: 'eco-tier', attrs: { 'data-tier': id }, style: pct(...TIER_LABEL_POS[id]) }, [el('strong', { text: t.label }), el('span', { text: t.sub })]));
  // Cada nivel agrupa su etiqueta y sus nodos: `display:contents` en escritorio, tarjeta en móvil.
  const core = el('div', { className: 'eco-core', style: pct(...CORE), attrs: { role: 'img', 'aria-label': 'OLLIN' } }, [el('span', { className: 'eco-core-logo' })]);
  const nodes = NODES.map(([tier, name, x, y, text, link], i) => el('button', { className: 'eco-node', type: 'button', text: name, style: `${pct(x, y)};--i:${i}`, attrs: { 'data-tier': tier, 'aria-pressed': 'false' } }));

  // Mini diagrama (solo móvil): un punto por nodo; tocarlo equivale a tocar el chip.
  const dots = NODES.map(([tier, name, x, y], i) => el('button', { className: 'eco-dot', type: 'button', style: pct(x, y), attrs: { 'data-tier': tier, 'aria-hidden': 'true', tabindex: '-1' }, onClick: () => nodes[i].click() }));
  const mini = el('div', { className: 'eco-mini' }, [svg, core, ...dots]);
  const branches = tierEls.map((t) => el('div', { className: 'eco-branch', attrs: { 'data-tier': t.dataset.tier } }, [t, ...nodes.filter((n) => n.dataset.tier === t.dataset.tier)]));

  const panel = el('div', { className: 'eco-panel', attrs: { 'aria-live': 'polite' } });
  let tier = 'all', selected = null;

  const render = (hover) => {
    const idx = nodes.indexOf(hover || selected);
    root.dataset.tier = tier;
    paths.forEach((p, i) => p.classList.toggle('is-on', i === idx));
    nodes.forEach((n) => n.setAttribute('aria-pressed', String(n === selected)));
    dots.forEach((d, i) => d.classList.toggle('is-on', i === idx));
    const [t, name, , , text, link] = idx >= 0 ? NODES[idx] : [tier, null, 0, 0, tier === 'all' ? 'Toca o pasa el cursor sobre un nodo para ver cómo se conecta con la base común.' : TIERS[tier].text, TIERS[tier]?.link];
    const [kicker, title] = name ? [TIERS[t].label, name] : [tier === 'all' ? 'Vista del ecosistema' : TIERS[tier].label, null];
    panel.replaceChildren(el('span', { className: 'eco-kicker', attrs: { 'data-tier': t === 'all' ? '' : t }, text: kicker }), ...(title ? [el('strong', { text: title })] : []), el('p', { text }), ...(link ? [el('a', { href: link[1], text: `${link[0]} →` })] : []));
  };

  nodes.forEach((n) => {
    n.addEventListener('click', () => { selected = selected === n ? null : n; render(); });
    ['pointerenter', 'focus'].forEach((ev) => n.addEventListener(ev, () => render(n)));
    ['pointerleave', 'blur'].forEach((ev) => n.addEventListener(ev, () => render()));
  });

  const tabs = [['all', 'Vista del ecosistema'], ...Object.entries(TIERS).map(([id, t]) => [id, t.label])].map(([id, label]) => el('button', { className: 'eco-tab', type: 'button', text: label, attrs: { 'data-tier': id, 'aria-pressed': String(id === 'all') }, onClick: () => { tier = id; selected = null; tabs.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tier === id))); render(); } }));

  root.append(
    el('div', { className: 'eco-frame' }, [
      el('div', { className: 'eco-tabs', attrs: { role: 'group', 'aria-label': 'Filtrar por nivel' } }, tabs),
      el('div', { className: 'eco-stage' }, [mini, ...branches]),
      panel,
    ]),
    el('figcaption', { className: 'eco-caption', text: 'Vista conceptual del ecosistema OLLIN.' }),
  );
  render();

  // Entrada escalonada al llegar al viewport; sin JS o con movimiento reducido todo queda visible.
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('is-ready');
    new IntersectionObserver(([e], io) => { if (e.isIntersecting) { root.classList.add('is-in'); io.disconnect(); } }, { threshold: 0.25 }).observe(root);
  }
  return root;
}
