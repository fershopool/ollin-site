const KEY = 'ollin:v1:preferences';
export function getPreferences() { try { return { theme: 'system', ...(JSON.parse(localStorage.getItem(KEY) || '{}')) }; } catch { return { theme: 'system' }; } }
export function savePreferences(update) { const next = { ...getPreferences(), ...update }; try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* fallback visual */ } return next; }
