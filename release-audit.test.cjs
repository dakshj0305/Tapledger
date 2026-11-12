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
