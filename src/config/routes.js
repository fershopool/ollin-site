import { environment } from './environment.js';

const base = (environment.baseUrl || '/').replace(/\/+$/, '');
export function withBase(path) {
  if (!path || path === '#') return path;
  if (path.startsWith('#')) return base ? `${base}/${path}` : `/${path}`;
  if (path.startsWith('http')) return path;
  return `${base}${path.startsWith('/') ? path : `/${path}`}` || '/';
}

export const routes = {
  home: withBase('/'), proyectos: withBase('/proyectos/'), principios: withBase('/principios/'), tecnologia: withBase('/tecnologia/'), impacto: withBase('/impacto/'), sobre: withBase('/sobre-ollin/'), tlatolli: withBase('/tlatolli/'), contacto: withBase('/contacto/'), privacidad: withBase('/aviso-de-privacidad/'), ecosistema: withBase('/ecosistema/'), instituciones: withBase('/participa/instituciones/'), comunidades: withBase('/participa/creadores-comunidades/'), talento: withBase('/participa/talento/'), propuestas: withBase('/participa/proyectos/'),
};
export function routeForPath(pathname = window.location.pathname) { const prefix = base || ''; const relative = prefix && pathname.startsWith(`${prefix}/`) ? pathname.slice(prefix.length) : pathname; const clean = relative.replace(/index\.html$/, '').replace(/\/+$/, '') || '/'; return ({'/':'home','/proyectos':'proyectos','/principios':'principios','/tecnologia':'tecnologia','/impacto':'impacto','/sobre-ollin':'sobre','/tlatolli':'tlatolli','/contacto':'contacto','/aviso-de-privacidad':'privacidad','/ecosistema':'ecosistema','/participa/instituciones':'instituciones','/participa/creadores-comunidades':'comunidades','/participa/talento':'talento','/participa/proyectos':'propuestas'})[clean] || 'not-found'; }
