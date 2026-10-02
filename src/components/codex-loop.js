import { el } from '../utils/dom.js';

// Arte vectorial propio por códice. Colores vía clases (.k1 pino, .k2 terracota, .k3 maíz, .k4 turquesa, .k5 papel)
// definidas en app.css: así respeta el tema claro/oscuro y no depende de un raster recortado.
const greca = (y, s = 12) => `<path class="stroke k3" d="M0 ${y}${`h${s}v-${s}h${s}v${s}`.repeat(Math.ceil(360 / (s * 2)))}"/>`;

const art = {
  // Memoria / Territorio: pirámide escalonada bajo un sol.
  memoria: `<circle class="k5" cx="282" cy="56" r="40"/><circle class="k3" cx="282" cy="56" r="30"/><circle class="k2" cx="282" cy="56" r="18"/><circle class="k5" cx="282" cy="56" r="7"/>
    <path class="k4" d="M0 170V150h360v20z"/><path class="k1" d="M40 150v-24h28v-24h28v-24h28v-24h56v24h28v24h28v24h28v24z"/>
    <path class="k2" d="M148 150v-20h24v20z"/><circle class="k3" cx="46" cy="40" r="6"/><circle class="k2" cx="68" cy="26" r="4"/><circle class="k4" cx="30" cy="68" r="4"/>${greca(166)}`,
  // Vínculos / Comunidades: anillos entrelazados y nodos.
  vinculos: `<g class="ring"><circle class="stroke k1" cx="120" cy="86" r="46"/><circle class="stroke k2" cx="180" cy="86" r="46"/><circle class="stroke k3" cx="240" cy="86" r="46"/></g>
    <circle class="k4" cx="180" cy="86" r="12"/><circle class="k5" cx="180" cy="86" r="4"/><circle class="k2" cx="46" cy="40" r="6"/><circle class="k1" cx="320" cy="130" r="8"/><circle class="k3" cx="318" cy="36" r="5"/><circle class="k4" cx="40" cy="134" r="5"/>${greca(166)}`,
  // Tlatolli / Ideas en conversación: voz que se propaga en arcos.
  tlatolli: `<circle class="k1" cx="120" cy="82" r="50"/><circle class="k2" cx="120" cy="82" r="34"/><circle class="k3" cx="120" cy="82" r="17"/><circle class="k5" cx="120" cy="82" r="6"/>
    <path class="stroke k4" d="M190 52a42 42 0 0 1 0 60M218 36a70 70 0 0 1 0 92M246 20a98 98 0 0 1 0 124"/><circle class="k2" cx="300" cy="46" r="6"/><circle class="k3" cx="320" cy="82" r="5"/><circle class="k1" cx="300" cy="118" r="6"/>${greca(166)}`,
  // Capacidad / Tecnología con propósito: retícula de módulos conectados.
  capacidad: `<path class="stroke k4" d="M60 40h80v50h80v-50h80M140 90v44h80"/>
    ${[[40, 24, 'k1'], [124, 24, 'k3'], [124, 74, 'k2'], [204, 74, 'k1'], [204, 118, 'k4'], [284, 24, 'k2'], [284, 74, 'k3'], [44, 74, 'k4']].map(([x, y, k]) => `<rect class="${k}" x="${x}" y="${y}" width="32" height="32" rx="8"/>`).join('')}<circle class="k5" cx="140" cy="90" r="5"/><circle class="k5" cx="220" cy="90" r="5"/>${greca(166)}`,
  // Horizonte / Oportunidades: sol naciente sobre capas de tierra.
  horizonte: `<g class="stroke k3" stroke-width="3">${[0, 1, 2, 3, 4, 5, 6].map((i) => { const a = Math.PI + (i * Math.PI) / 6; return `<path d="M${(180 + Math.cos(a) * 62).toFixed(1)} ${(112 + Math.sin(a) * 62).toFixed(1)}L${(180 + Math.cos(a) * 86).toFixed(1)} ${(112 + Math.sin(a) * 86).toFixed(1)}"/>`; }).join('')}</g>
    <path class="k3" d="M126 112a54 54 0 0 1 108 0z"/><path class="k2" d="M146 112a34 34 0 0 1 68 0z"/><path class="k5" d="M166 112a14 14 0 0 1 28 0z"/>
    <path class="k4" d="M0 112c60-18 120-8 180 0s120 12 180-6v64H0z"/><path class="k1" d="M0 138c70-14 130-4 190 4s110 4 170-8v36H0z"/>${greca(166)}`,
};

const codexes = [
  ['Memoria', 'Territorio', 'memoria'],
  ['Vínculos', 'Comunidades', 'vinculos'],
  ['Yancuic', 'Ideas en conversación', 'tlatolli'],
  ['Capacidad', 'Tecnología con propósito', 'capacidad'],
  ['Horizonte', 'Oportunidades', 'horizonte'],
];

function tile([title, subtitle, key], index, duplicate = false) {
  return el('article', { className: 'codex-tile', attrs: duplicate ? { 'aria-hidden': 'true' } : {} }, [
    el('div', { className: 'codex-tile-art', innerHTML: `<svg viewBox="0 0 360 170" preserveAspectRatio="xMidYMid slice" focusable="false" aria-hidden="true">${art[key]}</svg>` }),
    el('div', { className: 'codex-tile-copy' }, [el('span', { className: 'codex-tile-index', text: `Códice 0${index + 1}` }), el('h3', { text: title }), el('p', { text: subtitle })]),
  ]);
}

export function createCodexLoop() {
  const track = el('div', { className: 'codex-track' }, [false, true].flatMap((duplicate) => codexes.map((codex, index) => tile(codex, index, duplicate))));
  return el('section', { className: 'codex-loop section', id: 'codices' }, [el('div', { className: 'container' }, [el('div', { className: 'codex-loop-heading' }, [el('span', { className: 'eyebrow', text: 'Códices en movimiento' }), el('h2', { text: 'La memoria también puede avanzar.' }), el('p', { text: 'Una lectura continua de territorio, cultura, ideas y tecnología: los hilos que conectan el ecosistema OLLIN.' })]), el('div', { className: 'codex-marquee', attrs: { role: 'region', 'aria-label': 'Códices visuales de Ollin' } }, [el('div', { className: 'codex-marquee-viewport' }, [track])]), el('p', { className: 'codex-loop-note', text: 'El movimiento no se repite: se propaga.' })])]);
}
