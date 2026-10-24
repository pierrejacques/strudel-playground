// Every file in /patterns is loaded as plain text (not executed here).
const files = import.meta.glob('../patterns/*.js', { query: '?raw', import: 'default', eager: true });

export const patterns = Object.fromEntries(
  Object.entries(files)
    .map(([path, code]) => [path.split('/').pop().replace(/\.js$/, ''), code])
    .sort(([a], [b]) => a.localeCompare(b)),
);
