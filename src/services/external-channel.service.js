import { environment } from '../config/environment.js';
export const getContactChannel = () => environment.externalContactUrl || '';
export const getProjectUrl = (key) => key === 'cuicoyan' ? environment.cuicoyanUrl : key === 'calpulli' ? environment.calpulliUrl : '';
