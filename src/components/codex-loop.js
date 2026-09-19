import { el } from '../utils/dom.js';

const codexes = [
  ['Memoria', 'Territorio', '12% 16%'],
  ['Vínculos', 'Comunidades', '48% 14%'],
  ['Tlatolli', 'Ideas en conversación', '77% 22%'],
  ['Capacidad', 'Tecnología con propósito', '20% 70%'],
  ['Horizonte', 'Oportunidades', '62% 76%'],
];

function tile([title, subtitle, position], image, duplicate = false) {
  return el('article', { className: 'codex-tile', attrs: duplicate ? { 'aria-hidden': 'true' } : {} }, [
    el('div', { className: 'codex-tile-art', style: `--codex-position:${position};background-image:url("${image}")`, attrs: { 'aria-hidden': 'true' } }),
    el('div', { className: 'codex-tile-copy' }, [el('span', { className: 'codex-tile-index', text: 'Códice 0' }), el('h3', { text: title }), el('p', { text: subtitle })]),
  ]);
}

export function createCodexLoop(image) {
  const firstSet = codexes.map((codex, index) => {
    const item = tile(codex, image);
    item.querySelector('.codex-tile-index').textContent = `Códice 0${index + 1}`;
    return item;
  });
  const secondSet = codexes.map((codex, index) => {
    const item = tile(codex, image, true);
    item.querySelector('.codex-tile-index').textContent = `Códice 0${index + 1}`;
    return item;
  });
  const track = el('div', { className: 'codex-track' }, [...firstSet, ...secondSet]);
  return el('section', { className: 'codex-loop section', id: 'codices' }, [el('div', { className: 'container' }, [el('div', { className: 'codex-loop-heading' }, [el('span', { className: 'eyebrow', text: 'Códices en movimiento' }), el('h2', { text: 'La memoria también puede avanzar.' }), el('p', { text: 'Una lectura continua de territorio, cultura, ideas y tecnología: los hilos que conectan el ecosistema OLLIN.' })]), el('div', { className: 'codex-marquee', attrs: { role: 'region', 'aria-label': 'Códices visuales de Ollin' } }, [el('div', { className: 'codex-marquee-viewport' }, [track])]), el('p', { className: 'codex-loop-note', text: 'El movimiento no se repite: se propaga.' })])]);
}
