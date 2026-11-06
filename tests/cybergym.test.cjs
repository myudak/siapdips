const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const code = fs.readFileSync('src/content-cybergym.js', 'utf8');
function setup(pathname) {
  const listeners = {};
  const win = { addEventListener: (type, fn) => { listeners['window:' + type] = fn; } };
  const doc = { addEventListener: (type, fn) => { listeners['document:' + type] = fn; } };
  class Textarea { constructor(isEssay) { this.classList = { contains: name => isEssay && name === 'essay-textarea' }; } }
  vm.runInNewContext(code, { window: win, document: doc, location: { pathname }, HTMLTextAreaElement: Textarea });
  return { listeners, win, Textarea };
}
function event(target) { return { target, stopped: false, immediate: false, stopPropagation() { this.stopped = true; }, stopImmediatePropagation() { this.immediate = true; } }; }
test('registers only on quiz routes', () => { assert.deepEqual(Object.keys(setup('/other').listeners), []); });
test('suppresses visibility and window blur, but not element blur', () => {
  const { listeners, win } = setup('/quiz');
  const vis = event(); listeners['document:visibilitychange'](vis); assert.equal(vis.immediate, true);
  const blur = event(win); listeners['window:blur'](blur); assert.equal(blur.immediate, true);
  const elementBlur = event({}); listeners['window:blur'](elementBlur); assert.equal(elementBlur.immediate, false);
});
test('suppresses clipboard propagation only for essay fields', () => {
  const { listeners, Textarea } = setup('/quiz');
  for (const type of ['copy', 'cut', 'paste']) {
    const essay = event(new Textarea(true)); listeners['document:' + type](essay); assert.equal(essay.stopped, true);
    const other = event(new Textarea(false)); listeners['document:' + type](other); assert.equal(other.stopped, false);
  }
});

test('Chromium manifests inject on the configured quiz domain at document start', () => {
  for (const browser of ['chrome', 'edge']) {
    const manifest = JSON.parse(fs.readFileSync('src/manifest-' + browser + '.json', 'utf8'));
    const script = manifest.content_scripts.find(entry => entry.js?.includes('./content-cybergym.js'));
    assert.ok(script);
    assert.ok(script.matches.includes('https://quiz-tracker-seven.vercel.app/quiz*'));
    assert.equal(script.run_at, 'document_start');
    assert.equal(script.world, 'MAIN');
  }
});
