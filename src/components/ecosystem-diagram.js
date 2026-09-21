import { el } from '../utils/dom.js';

const layers = [
  {
    key: 'projects',
    label: 'Experiencias y proyectos',
    className: 'ecosystem-layer--projects',
    nodes: [
      { id: 'cuicoyan', label: 'Cuicoyan', position: { x: '8%', y: '13%', svg: [110, 110] } },
      { id: 'calpulli', label: 'UPIICSA Calpolli', position: { x: '28%', y: '8%', svg: [295, 78] } },
      { id: 'tlatolli', label: 'Tlatolli', position: { x: '48%', y: '8%', svg: [480, 78] } },
      { id: 'yancuic', label: 'Yancuic Tech', position: { x: '68%', y: '12%', svg: [665, 100] } },
      { id: 'future', label: 'Futuras iniciativas', position: { x: '88%', y: '16%', svg: [885, 120] } },
    ],
  },
  {
    key: 'capabilities',
    label: 'Capacidades compartidas',
    className: 'ecosystem-layer--capabilities',
    nodes: [
      { id: 'identity', label: 'Identidad y acceso', position: { x: '8%', y: '48%', svg: [100, 375] } },
      { id: 'communication', label: 'Comunicación', position: { x: '24%', y: '51%', svg: [250, 390] } },
      { id: 'territory', label: 'Mapas y territorio', position: { x: '39%', y: '48%', svg: [390, 370] } },
      { id: 'data', label: 'Datos con propósito', position: { x: '61%', y: '48%', svg: [610, 370] } },
      { id: 'interoperability', label: 'Interoperabilidad', position: { x: '76%', y: '51%', svg: [760, 390] } },
      { id: 'responsible-ai', label: 'IA responsable', position: { x: '90%', y: '48%', svg: [900, 375] } },
    ],
  },
  {
    key: 'principles',
    label: 'Principios y base',
    className: 'ecosystem-layer--principles',
    nodes: [
      { id: 'privacy', label: 'Privacidad desde el diseño', position: { x: '8%', y: '82%', svg: [110, 625] } },
      { id: 'security', label: 'Seguridad', position: { x: '27%', y: '85%', svg: [275, 650] } },
      { id: 'standards', label: 'Estándares', position: { x: '43%', y: '82%', svg: [430, 635] } },
      { id: 'transparency', label: 'Transparencia', position: { x: '59%', y: '82%', svg: [590, 635] } },
      { id: 'governance', label: 'Gobernanza', position: { x: '75%', y: '85%', svg: [750, 650] } },
      { id: 'mexican-tech', label: 'Capacidad tecnológica mexicana', position: { x: '89%', y: '82%', svg: [885, 625] } },
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
function connectionPath(from, to) {
  const [x1, y1] = nodeMap.get(from).position.svg;
  const [x2, y2] = nodeMap.get(to).position.svg;
  const bend = Math.max(24, Math.abs(x2 - x1) * 0.18);
  const direction = y2 >= y1 ? 1 : -1;
  return `M ${x1} ${y1} C ${x1 + bend} ${y1 + 55 * direction}, ${x2 - bend} ${y2 - 55 * direction}, ${x2} ${y2}`;
}

export function createEcosystemDiagram() {
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
      const nodeElement = el('span', {
        className: `ecosystem-node ecosystem-node--${layer.key}`,
        style: `--node-x:${node.position.x};--node-y:${node.position.y}`,
        attrs: { 'data-node': node.id, 'aria-label': `${node.label}, ${layer.label}` },
      }, [el('span', { className: 'ecosystem-node-dot', attrs: { 'aria-hidden': 'true' } }), el('span', { text: node.label })]);
      layerElement.append(nodeElement);
    });
    stage.append(layerElement);
  });

  stage.append(svg, core);
  const title = el('h3', { className: 'sr-only', id: 'ecosystem-interaction-title', text: 'Explora las conexiones del ecosistema OLLIN' });
  const toolbar = el('div', { className: 'ecosystem-toolbar' }, [
    el('span', { className: 'demo', text: 'Ecosistema en movimiento' }),
    el('p', { className: 'ecosystem-hint', text: 'Desplázate para revelar la profundidad de sus conexiones.' }),
  ]);
  const status = el('p', { className: 'ecosystem-status', text: 'Una base común que se despliega en tres planos.' });
  const legend = el('div', { className: 'ecosystem-legend', attrs: { 'aria-label': 'Leyenda del diagrama' } }, [
    el('span', { className: 'ecosystem-legend-item ecosystem-legend-item--projects', text: 'Experiencias y proyectos' }),
    el('span', { className: 'ecosystem-legend-item ecosystem-legend-item--capabilities', text: 'Capacidades compartidas' }),
    el('span', { className: 'ecosystem-legend-item ecosystem-legend-item--principles', text: 'Principios y base' }),
  ]);

  let scrollFrame = 0;
  const updateScrollMotion = () => {
    scrollFrame = 0;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = diagram.getBoundingClientRect();
    const progress = Math.max(-0.55, Math.min(1.15, (window.innerHeight * 0.7 - bounds.top) / (window.innerHeight + bounds.height) * 1.9));
    diagram.style.setProperty('--scroll-progress', progress.toFixed(3));
  };
  const requestScrollMotion = () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(updateScrollMotion);
  };
  window.addEventListener('scroll', requestScrollMotion, { passive: true });
  window.addEventListener('resize', requestScrollMotion);
  requestScrollMotion();

  diagram.append(title, toolbar, stage, legend, status);
  return diagram;
}
