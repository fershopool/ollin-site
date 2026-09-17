import { siteBase } from './site-base.js';

export const environment = {
  baseUrl: import.meta.env?.VITE_BASE_URL || siteBase || '/',
  cuicoyanUrl: import.meta.env?.VITE_CUICOYAN_URL || '',
  calpulliUrl: import.meta.env?.VITE_CALPULLI_URL || '',
  externalContactUrl: import.meta.env?.VITE_EXTERNAL_CONTACT_URL || '',
};
