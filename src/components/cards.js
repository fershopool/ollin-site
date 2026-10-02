import { el } from '../utils/dom.js';
import { routes } from '../config/routes.js';
import { getProjectUrl } from '../services/external-channel.service.js';

export function projectCard(project) {
  const internal = project.linkKey === 'tlatolli';
  const href = internal ? routes.tlatolli : getProjectUrl(project.linkKey);
  const external = !!href && href.startsWith('http');
  const action = href
    ? el('a', { className: 'project-cta', href, target: external ? '_blank' : undefined, rel: external ? 'noopener noreferrer' : undefined, attrs: external ? { 'aria-label': `Visitar ${project.name} (se abre en una pestaña nueva)` } : {} }, [internal ? 'Ir a Yancuic' : 'Visitar sitio', el('span', { className: 'project-cta-arrow', text: external ? '↗' : '→', attrs: { 'aria-hidden': 'true' } })])
    : el('button', { className: 'project-cta is-disabled', type: 'button', disabled: true, text: 'Próximamente' });
  const status = external ? el('small', { className: 'project-live', text: 'Sitio en línea' }) : el('small', { className: 'muted', text: 'Estado público por verificar' });
  const asset = (name) => new URL(`../assets/projects/${name}`, import.meta.url).href;
  const logo = el('span', { className: 'project-logo', attrs: { 'aria-hidden': 'true' } }, [el('img', { src: asset(project.logo), alt: '', loading: 'lazy', decoding: 'async' })]);
  const media = project.preview
    ? el('div', { className: 'project-media' }, [el('img', { src: asset(project.preview), alt: `Vista previa del sitio de ${project.name}`, loading: 'lazy', decoding: 'async', width: 1280, height: 800 }), logo])
    : el('div', { className: 'project-media is-empty' }, [el('span', { className: 'project-media-soon', text: 'Vista previa en preparación' }), logo]);
  return el('article', { className: `project-card${project.id === 'cuicoyan' ? ' featured' : ''}${href ? ' is-linked' : ''}` }, [media, el('div', { className: 'project-body' }, [el('span', { className: 'demo', text: project.status }), el('h3', { text: project.name }), el('p', { className: 'muted', text: project.tagline }), el('p', { text: project.description }), el('div', { className: 'card-footer' }, [status, action])])]);
}
const PRINCIPLE_ICONS = {
  purpose: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  data: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  open: '<path d="M12 12c-1.5-2.5-3-4-5-4a4 4 0 0 0 0 8c2 0 3.5-1.5 5-4zm0 0c1.5 2.5 3 4 5 4a4 4 0 0 0 0-8c-2 0-3.5 1.5-5 4z"/>',
  capacity: '<path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z"/>',
  community: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.2A5 5 0 0 1 21 19"/>',
  value: '<path d="M20 11a8 8 0 0 0-14-4L4 9M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2M20 20v-5h-5"/>'
};
export function principleCard(item, index) { return el('article', { className: 'principle-card' }, [el('div', { className: 'principle-head' }, [el('div', { className: 'principle-icon', innerHTML: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${PRINCIPLE_ICONS[item.icon] || ''}</svg>`, attrs: { 'aria-hidden': 'true' } }), el('span', { className: 'principle-num', text: String(index + 1).padStart(2, '0') })]), el('h3', { text: item.title }), el('p', { className: 'muted', text: item.description })]); }
export function impactCard(item) { return el('article', { className: 'impact-card' }, [el('span', { className: 'impact-number', text: item.icon }), el('h3', { text: item.title }), el('p', { className: 'muted', text: item.description })]); }
export function articleCard(item) { return el('article', { className: 'article-card' }, [el('span', { className: 'badge', text: item.category }), el('h3', { text: item.title }), el('span', { className: 'status', text: item.status })]); }
