import { el } from '../utils/dom.js';
import { routes } from '../config/routes.js';
import { getProjectUrl } from '../services/external-channel.service.js';

export function projectCard(project) {
  const internal = project.linkKey === 'tlatolli';
  const href = internal ? routes.tlatolli : getProjectUrl(project.linkKey);
  const external = !!href && href.startsWith('http');
  const action = href
    ? el('a', { className: 'project-cta', href, target: external ? '_blank' : undefined, rel: external ? 'noopener noreferrer' : undefined, attrs: external ? { 'aria-label': `Visitar ${project.name} (se abre en una pestaña nueva)` } : {} }, [internal ? 'Ir a Tlatolli' : 'Visitar sitio', el('span', { className: 'project-cta-arrow', text: external ? '↗' : '→', attrs: { 'aria-hidden': 'true' } })])
    : el('button', { className: 'project-cta is-disabled', type: 'button', disabled: true, text: 'Próximamente' });
  const status = external ? el('small', { className: 'project-live', text: 'Sitio en línea' }) : el('small', { className: 'muted', text: 'Estado público por verificar' });
  return el('article', { className: `project-card${project.id === 'cuicoyan' ? ' featured' : ''}${href ? ' is-linked' : ''}` }, [el('div', { className: 'project-mark', text: project.name.slice(0, 2).toUpperCase(), attrs: { 'aria-hidden': 'true' } }), el('span', { className: 'demo', text: project.status }), el('h3', { text: project.name }), el('p', { className: 'muted', text: project.tagline }), el('p', { text: project.description }), el('div', { className: 'card-footer' }, [status, action])]);
}
export function principleCard(item, index) { return el('article', { className: 'principle-card' }, [el('div', { className: 'principle-icon', text: item.icon, attrs: { 'aria-hidden': 'true' } }), el('span', { className: 'muted', text: `0${index + 1}` }), el('h3', { text: item.title }), el('p', { className: 'muted', text: item.description })]); }
export function impactCard(item) { return el('article', { className: 'impact-card' }, [el('span', { className: 'impact-number', text: item.icon }), el('h3', { text: item.title }), el('p', { className: 'muted', text: item.description })]); }
export function articleCard(item) { return el('article', { className: 'article-card' }, [el('span', { className: 'badge', text: item.category }), el('h3', { text: item.title }), el('span', { className: 'status', text: item.status })]); }
