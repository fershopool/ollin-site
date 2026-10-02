import { environment } from '../config/environment.js';
export async function sendContact(data) {
  const res = await fetch(environment.contactEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || String(body.success) === 'false') throw new Error(body.message || res.status);
}
export const getProjectUrl = (key) => key === 'cuicoyan' ? environment.cuicoyanUrl : key === 'calpulli' ? environment.calpulliUrl : key === 'agencia' ? environment.agenciaUrl : '';
