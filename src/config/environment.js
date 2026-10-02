import { siteBase } from './site-base.js';

export const environment = {
  baseUrl: import.meta.env?.VITE_BASE_URL || siteBase || '/',
  cuicoyanUrl: import.meta.env?.VITE_CUICOYAN_URL || 'https://fershopool.github.io/cuicoyan-site/',
  calpulliUrl: import.meta.env?.VITE_CALPULLI_URL || 'https://fershopool.github.io/upiicsa-calpulli-site/',
  agenciaUrl: import.meta.env?.VITE_AGENCIA_URL || 'https://fershopool.github.io/tlatolli-site/',
  contactEndpoint: import.meta.env?.VITE_CONTACT_ENDPOINT || 'https://formsubmit.co/ajax/ollinecosistema@gmail.com',
};
