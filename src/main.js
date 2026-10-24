import '@strudel/repl';
import { patterns as initialPatterns } from './patterns.js';

// Strudel unlocks audio (and loads the AudioWorklets behind supersaw, crush, shape, ...)
// on the first mousedown only. Forward the first keypress as a mousedown, so playing
// straight from the keyboard doesn't leave those effects broken.
const forwardFirstKey = () => document.dispatchEvent(new MouseEvent('mousedown'));
window.addEventListener('keydown', forwardFirstKey, { capture: true, once: true });
document.addEventListener('mousedown', () => window.removeEventListener('keydown', forwardFirstKey, true), {
  capture: true,
  once: true,
});

let patterns = initialPatterns;

const select = document.getElementById('pattern-select');
const fillSelect = () => {
  const current = select.value;
  select.replaceChildren(...Object.keys(patterns).map((name) => new Option(name, name)));
  if (current in patterns) select.value = current;
};
fillSelect();

const requested = new URLSearchParams(location.search).get('p');
select.value = [requested, 'demo'].find((n) => n in patterns) ?? Object.keys(patterns)[0];

const repl = document.createElement('strudel-editor');
repl.setAttribute('code', patterns[select.value]);
document.getElementById('repl').append(repl);

// Strudel only binds Ctrl/Alt+Enter and Ctrl/Alt+. — add the ⌘ variants for macOS.
window.addEventListener(
  'keydown',
  (e) => {
    if (!e.metaKey || !repl.editor) return;
    if (e.key === 'Enter') repl.editor.evaluate();
    else if (e.key === '.') repl.editor.stop();
    else return;
    e.preventDefault();
    e.stopPropagation();
  },
  true,
);

select.addEventListener('change', () => {
  repl.editor?.stop();
  repl.setAttribute('code', patterns[select.value]);
  history.replaceState(null, '', `?p=${select.value}`);
});

// Editing a file in /patterns swaps the new code into the editor without a page reload,
// so playback keeps going; press Ctrl/Cmd+Enter to hear the change.
if (import.meta.hot) {
  import.meta.hot.accept('./patterns.js', (mod) => {
    if (!mod) return;
    const previous = patterns;
    patterns = mod.patterns;
    fillSelect();
    if (patterns[select.value] !== previous[select.value]) {
      repl.setAttribute('code', patterns[select.value]);
    }
  });
}
