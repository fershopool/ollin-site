import { el } from '../utils/dom.js';

const layers = [
  {
    key: 'projects',
    label: 'Experiencias y proyectos',
    className: 'ecosystem-layer--projects',
    nodes: [
      { id: 'cuicoyan', label: 'Cuicoyan', position: { x: '2%', y: '12%', svg: [100, 128] } },
      { id: 'calpulli', label: 'UPIICSA Calpolli', position: { x: '25%', y: '3%', svg: [300, 76] } },
      { id: 'tlatolli', label: 'Tlatolli', position: { x: '48%', y: '2%', svg: [500, 74] } },
      { id: 'yancuic', label: 'Yancuic Tech', position: { x: '70%', y: '7%', svg: [700, 98] } },
      { id: 'future', label: 'Futuras iniciativas', position: { x: '86%', y: '15%', svg: [900, 142] } },
    ],
  },
  {
    key: 'capabilities',
    label: 'Capacidades compartidas',
    className: 'ecosystem-layer--capabilities',
    nodes: [
      { id: 'identity', label: 'Identidad y acceso', position: { x: '0%', y: '48%', svg: [78, 378] } },
      { id: 'communication', label: 'Comunicación', position: { x: '18%', y: '51%', svg: [260, 395] } },
      { id: 'territory', label: 'Mapas y territorio', position: { x: '35%', y: '48%', svg: [425, 378] } },
      { id: 'data', label: 'Datos con propósito', position: { x: '57%', y: '48%', svg: [610, 378] } },
      { id: 'interoperability', label: 'Interoperabilidad', position: { x: '74%', y: '51%', svg: [775, 395] } },
      { id: 'responsible-ai', label: 'IA responsable', position: { x: '88%', y: '48%', svg: [925, 378] } },
    ],
  },
  {
    key: 'principles',
    label: 'Principios y base',
    className: 'ecosystem-layer--principles',
    nodes: [
      { id: 'privacy', label: 'Privacidad desde el diseño', position: { x: '3%', y: '82%', svg: [110, 635] } },
      { id: 'security', label: 'Seguridad', position: { x: '25%', y: '86%', svg: [300, 665] } },
      { id: 'standards', label: 'Estándares', position: { x: '42%', y: '84%', svg: [455, 650] } },
      { id: 'transparency', label: 'Transparencia', position: { x: '59%', y: '84%', svg: [615, 650] } },
      { id: 'governance', label: 'Gobernanza', position: { x: '76%', y: '86%', svg: [770, 665] } },
      { id: 'mexican-tech', label: 'Capacidad tecnológica mexicana', position: { x: '88%', y: '82%', svg: [910, 635] } },
    ],
  },
];

const relations = [
  ['cuicoyan', 'communication'], ['cuicoyan', 'territory'], ['cuicoyan', 'data'],
  ['calpulli', 'identity'], ['calpulli', 'communication'], ['calpulli', 'interoperability'],
  ['tlatolli', 'communication'], ['tlatolli', 'data'],
  ['yancuic', 'data'], ['yancuic', 'interoperability'], ['yancuic', 'responsible-ai'],
  ['future', 'identity'], ['future', 'interoperability'],
  ['identity', 'privacy'], ['identity', 'governance'],
  ['communication', 'transparency'], ['communication', 'mexican-tech'],
  ['territory', 'privacy'], ['territory', 'standards'],
  ['data', 'privacy'], ['data', 'security'], ['data', 'transparency'],
  ['interoperability', 'standards'], ['interoperability', 'governance'], ['interoperability', 'mexican-tech'],
  ['responsible-ai', 'privacy'], ['responsible-ai', 'transparency'], ['responsible-ai', 'governance'],
];

const nodeMap = new Map(layers.flatMap((layer) => layer.nodes.map((node) => [node.id, node])));
const relationMap = new Map([...nodeMap.keys()].map((id) => [id, new Set()]));
relations.forEach(([from, to]) => {
  relationMap.get(from).add(to);
  relationMap.get(to).add(from);
});

function connectionPath(from, to) {
  const [x1, y1] = nodeMap.get(from).position.svg;
  const [x2, y2] = nodeMap.get(to).position.svg;
  const bend = Math.max(24, Math.abs(x2 - x1) * 0.18);
  const direction = y2 >= y1 ? 1 : -1;
  return `M ${x1} ${y1} C ${x1 + bend} ${y1 + 55 * direction}, ${x2 - bend} ${y2 - 55 * direction}, ${x2} ${y2}`;
}

function getNeighborhood(id) {
  const found = new Set([id]);
  let frontier = [id];
  for (let depth = 0; depth < 2; depth += 1) {
    frontier = frontier.flatMap((current) => [...(relationMap.get(current) || [])].filter((next) => !found.has(next)));
    frontier.forEach((next) => found.add(next));
  }
  return found;
}

function pathIsRelated(path, activeIds) {
  return path.dataset.nodes.split(' ').some((id) => activeIds.has(id));
}

export function createEcosystemDiagram() {
  const nodeButtons = [];
  const paths = [];
  const stage = el('div', { className: 'ecosystem-stage' });
  const diagram = el('div', { className: 'ecosystem-diagram', attrs: { 'aria-labelledby': 'ecosystem-interaction-title' } });

  const svg = el('svg', {
    attrs: { class: 'ecosystem-lines', viewBox: '0 0 1000 760', role: 'img', 'aria-label': 'Conexiones entre proyectos, capacidades y principios de OLLIN' },
  }, [
    el('defs', {}, [
      el('filter', { id: 'ecosystem-glow', x: '-30%', y: '-30%', width: '160%', height: '160%' }, [el('feGaussianBlur', { stdDeviation: '3', result: 'blur' }), el('feMerge', {}, [el('feMergeNode', { in: 'blur' }), el('feMergeNode', { in: 'SourceGraphic' })])]),
      el('radialGradient', { id: 'ecosystem-core-glow' }, [el('stop', { offset: '0%', 'stop-color': '#8fd3cd', 'stop-opacity': '.5' }), el('stop', { offset: '100%', 'stop-color': '#8fd3cd', 'stop-opacity': '0' })]),
    ]),
    el('circle', { className: 'ecosystem-orbit ecosystem-orbit--outer', cx: '500', cy: '390', r: '330' }),
    el('circle', { className: 'ecosystem-orbit ecosystem-orbit--middle', cx: '500', cy: '390', r: '242' }),
    el('circle', { className: 'ecosystem-orbit ecosystem-orbit--inner', cx: '500', cy: '390', r: '150' }),
    el('circle', { className: 'ecosystem-core-glow', cx: '500', cy: '390', r: '132', fill: 'url(#ecosystem-core-glow)' }),
    ...relations.map(([from, to]) => {
      const path = el('path', { className: 'ecosystem-path', d: connectionPath(from, to), attrs: { 'data-nodes': `${from} ${to}` } });
      paths.push(path);
      return path;
    }),
  ]);

  const core = el('div', { className: 'ecosystem-core', attrs: { 'aria-label': 'Núcleo OLLIN' } }, [
    el('span', { className: 'ecosystem-core-mark', text: '∞', attrs: { 'aria-hidden': 'true' } }),
    el('strong', { text: 'OLLIN' }),
    el('span', { className: 'ecosystem-core-caption', text: 'base compartida' }),
  ]);

  layers.forEach((layer) => {
    const layerElement = el('div', { className: `ecosystem-layer ${layer.className}`, attrs: { 'aria-label': layer.label } }, [
      el('span', { className: 'ecosystem-layer-label', text: layer.label }),
    ]);
    layer.nodes.forEach((node) => {
      const button = el('button', {
        className: `ecosystem-node ecosystem-node--${layer.key}`,
        style: `--node-x:${node.position.x};--node-y:${node.position.y}`,
        attrs: { type: 'button', 'data-node': node.id, 'aria-pressed': 'false', 'aria-label': `${node.label}, ${layer.label}` },
      }, [el('span', { className: 'ecosystem-node-dot', attrs: { 'aria-hidden': 'true' } }), el('span', { text: node.label })]);
      nodeButtons.push(button);
      layerElement.append(button);
    });
    stage.append(layerElement);
  });

  stage.append(svg, core);
  const title = el('h3', { className: 'sr-only', id: 'ecosystem-interaction-title', text: 'Explora las conexiones del ecosistema OLLIN' });
  const toolbar = el('div', { className: 'ecosystem-toolbar' }, [
    el('span', { className: 'demo', text: 'Explora las conexiones' }),
    el('p', { className: 'ecosystem-hint', text: 'Pasa el cursor o enfoca un nodo para ver cómo se conecta.' }),
  ]);
  const status = el('p', { className: 'ecosystem-status', attrs: { 'aria-live': 'polite' }, text: 'Todas las relaciones visibles' });
  const legend = el('div', { className: 'ecosystem-legend', attrs: { 'aria-label': 'Leyenda del diagrama' } }, [
    el('span', { className: 'ecosystem-legend-item ecosystem-legend-item--projects', text: 'Experiencias y proyectos' }),
    el('span', { className: 'ecosystem-legend-item ecosystem-legend-item--capabilities', text: 'Capacidades compartidas' }),
    el('span', { className: 'ecosystem-legend-item ecosystem-legend-item--principles', text: 'Principios y base' }),
  ]);

  let pinnedNode = null;
  const clearActive = () => {
    if (pinnedNode) return;
    diagram.dataset.active = 'none';
    nodeButtons.forEach((node) => {
      node.classList.remove('is-active');
      node.setAttribute('aria-pressed', 'false');
    });
    paths.forEach((path) => path.classList.remove('is-active'));
    status.textContent = 'Todas las relaciones visibles';
  };
  const activate = (id) => {
    const activeIds = getNeighborhood(id);
    const selected = nodeMap.get(id);
    diagram.dataset.active = id;
    nodeButtons.forEach((node) => {
      const isActive = activeIds.has(node.dataset.node);
      node.classList.toggle('is-active', isActive);
      node.setAttribute('aria-pressed', node.dataset.node === id ? 'true' : 'false');
    });
    paths.forEach((path) => path.classList.toggle('is-active', pathIsRelated(path, activeIds)));
    status.textContent = `${selected.label}: muestra sus relaciones dentro del ecosistema.`;
  };

  nodeButtons.forEach((button) => {
    button.addEventListener('pointerenter', () => activate(button.dataset.node));
    button.addEventListener('focus', () => activate(button.dataset.node));
    button.addEventListener('pointerleave', clearActive);
    button.addEventListener('mouseenter', () => activate(button.dataset.node));
    button.addEventListener('mouseleave', clearActive);
    button.addEventListener('touchstart', () => activate(button.dataset.node), { passive: true });
    button.addEventListener('blur', clearActive);
    button.addEventListener('click', () => {
      pinnedNode = pinnedNode === button.dataset.node ? null : button.dataset.node;
      if (pinnedNode) activate(pinnedNode);
      else clearActive();
    });
  });

  const handlePointerMove = (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = stage.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 8;
    stage.style.setProperty('--pointer-x', `${x.toFixed(2)}px`);
    stage.style.setProperty('--pointer-y', `${y.toFixed(2)}px`);
  };
  const resetPointer = () => {
    stage.style.setProperty('--pointer-x', '0px');
    stage.style.setProperty('--pointer-y', '0px');
  };
  stage.addEventListener('pointermove', handlePointerMove);
  stage.addEventListener('pointerleave', resetPointer);
  stage.addEventListener('mousemove', handlePointerMove);
  stage.addEventListener('mouseleave', resetPointer);
  diagram.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    pinnedNode = null;
    clearActive();
    nodeButtons[0]?.focus();
  });

  diagram.append(title, toolbar, stage, legend, status);
  return diagram;
}
