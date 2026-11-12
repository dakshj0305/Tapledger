const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const read = name => fs.readFileSync(path.join(root, name), 'utf8');

test('every service-worker precache entry exists in the published project', () => {
  const sw = read('sw.js');
  const match = sw.match(/const CACHE='([^']+)'/);
  assert.ok(match, 'cache version is declared');
  const filesMatch = sw.match(/const APP_FILES=\[(.*?)\];/s);
  assert.ok(filesMatch, 'precache manifest is declared');
  const files = [...filesMatch[1].matchAll(/'([^']*)'/g)].map(m => m[1]);
  assert.ok(files.includes('index.html'));
  assert.equal(new Set(files).size, files.length, 'precache entries are unique');
  for (const file of files.filter(Boolean)) assert.ok(fs.existsSync(path.join(root, file)), `missing precache file: ${file}`);
});

test('all local scripts and styles referenced by the entry page exist', () => {
  const html = read('index.html');
  for (const match of html.matchAll(/(?:src|href)="\.\/([^"?#]+)"/g)) {
    const file = match[1];
    assert.ok(fs.existsSync(path.join(root, file)), `missing page dependency: ${file}`);
  }
});

test('PWA manifest and CSP remain self-hosted and parseable', () => {
  const manifest = JSON.parse(read('manifest.webmanifest'));
  assert.equal(manifest.scope, './');
  assert.equal(manifest.start_url, './');
  for (const icon of manifest.icons) assert.ok(fs.existsSync(path.join(root, icon.src.replace(/^\.\//, ''))), `missing PWA icon ${icon.src}`);
  const html = read('index.html');
  assert.match(html, /Content-Security-Policy/);
  assert.doesNotMatch(html, /<script[^>]+src="https?:/i);
});

test('scroll chapters and liquid-metal enhancement are wired and degrade gracefully', () => {
  const html = read('index.html');
  const story = read('scroll-story.js');
  const liquid = read('liquid-metal.js');
  assert.match(html, /id="view-overview"/);
  assert.match(html, /class="scroll-chapter-nav"/);
  assert.match(story, /IntersectionObserver/);
  assert.match(story, /prefers-reduced-motion/);
  assert.match(story, /scrollIntoView/);
  assert.match(liquid, /prefers-reduced-motion/);
  assert.match(liquid, /addEventListener/);
});

test('visual repair layer, brand mark, and mobile navigation are complete', () => {
  const html = read('index.html');
  const css = read('polish.css');
  const mark = read('icons/voltura-mark.svg');
  assert.match(html, /href="\.\/polish\.css"/);
  assert.match(html, /class="brand-manifesto"/);
  assert.doesNotMatch(html, /In every bottle|Real Magic of sharing pure Refreshment/);
  assert.match(css, /@media\(max-width:680px\)/);
  assert.match(css, /safe-area-inset-bottom/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(mark, /<svg/);
  assert.match(mark, /VOLTURA/);
  assert.ok(fs.statSync(path.join(root, 'icons/icon-192.png')).size > 1000);
  assert.ok(fs.statSync(path.join(root, 'icons/icon-512.png')).size > 1000);
});

test('service worker cache version and update checks are advanced', () => {
  const worker = read('sw.js'), app = read('app.js');
  assert.match(worker, /voltura-platform-v20\.6/);
  assert.match(worker, /'polish\.css'/);
  assert.match(app, /updateViaCache:'none'/);
  assert.match(app, /registration\.update\(\)/);
});


test('brand icon assets and manifest theme color match the refreshed identity', () => {
  const manifest = JSON.parse(read('manifest.webmanifest'));
  assert.equal(manifest.theme_color.toLowerCase(), '#d7f36a');
  for (const size of [192, 512]) {
    for (const suffix of ['', '-maskable']) {
      const file = path.join(root, `icons/icon-${size}${suffix}.png`);
      assert.ok(fs.existsSync(file), `missing refreshed icon ${file}`);
      assert.ok(fs.statSync(file).size > 1000, `icon appears unexpectedly small: ${file}`);
    }
  }
});
