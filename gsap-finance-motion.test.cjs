const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const read = name => fs.readFileSync(name, 'utf8');

test('GSAP core and plugins are loaded locally in dependency order', () => {
  const html = read('index.html');
  const names = ['gsap.min.js', 'ScrollTrigger.min.js', 'DrawSVGPlugin.min.js', 'MotionPathPlugin.min.js', 'Flip.min.js', 'finance-core.js', 'app.js', 'gsap-motion.js'];
  const positions = names.map(name => html.indexOf('./' + (name.includes('/') ? name : name.startsWith('gsap') || name.startsWith('Scroll') || name.startsWith('Draw') || name.startsWith('Motion') || name === 'Flip.min.js' ? 'vendor/gsap/' + name : name)));
  assert.ok(positions.every(x => x >= 0), 'every required script is referenced');
  assert.deepEqual(positions, [...positions].sort((a,b)=>a-b), 'scripts must load in dependency order');
});

test('all bundled GSAP assets report the same version', () => {
  for (const file of ['gsap.min.js','ScrollTrigger.min.js','DrawSVGPlugin.min.js','MotionPathPlugin.min.js','Flip.min.js']) {
    assert.match(read('vendor/gsap/' + file).slice(0,300), /3\.15\.1/, file + ' version');
  }
});

test('service worker precaches all new local GSAP assets and has a new cache namespace', () => {
  const sw = read('sw.js');
  assert.match(sw, /voltura-platform-v26\.1\.2-gsap-finance-motion/);
  for (const file of ['gsap-motion.js','vendor/gsap/DrawSVGPlugin.min.js','vendor/gsap/MotionPathPlugin.min.js','vendor/gsap/Flip.min.js']) {
    assert.ok(sw.includes("'" + file + "'"), 'precache contains ' + file);
    assert.ok(fs.existsSync(file), 'precache target exists: ' + file);
  }
});

test('finance animation is progressive, reduced-motion aware and uses stable chart identities', () => {
  const motion = read('gsap-motion.js'), app = read('app.js'), html = read('index.html');
  assert.match(motion, /prefers-reduced-motion: reduce/);
  assert.match(motion, /MotionPathPlugin/);
  assert.match(motion, /DrawSVGPlugin/);
  assert.match(motion, /Flip/);
  assert.match(app, /data-flip-id="cashflow-\$\{k\}"/);
  assert.match(html, /id="balanceFlowPath"/);
  assert.match(html, /aria-hidden="true"[^>]*focusable="false"/);
});
