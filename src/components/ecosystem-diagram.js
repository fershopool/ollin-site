import { el } from '../utils/dom.js';

const ecosystemAsset = `${new URL('../assets/brand/ecosistema-ollin.png', import.meta.url).href}?v=20260920-ecosistema`;

export function createEcosystemDiagram() {
  const figure = el('figure', {
    className: 'ecosystem-visual',
    attrs: { 'aria-labelledby': 'ecosystem-visual-caption' },
  });
  const frame = el('div', { className: 'ecosystem-visual-frame' }, [
    el('img', {
      className: 'ecosystem-visual-image',
      src: ecosystemAsset,
      alt: 'Diagrama conceptual del ecosistema OLLIN: experiencias y proyectos, capacidades compartidas y principios y base alrededor de una base común.',
      loading: 'lazy',
      decoding: 'async',
    }),
  ]);
  const caption = el('figcaption', {
    className: 'ecosystem-visual-caption',
    attrs: { id: 'ecosystem-visual-caption' },
    text: 'Vista conceptual del ecosistema OLLIN.',
  });
  figure.append(frame, caption);
  return figure;
}
