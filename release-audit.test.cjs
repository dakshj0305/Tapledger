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
  assert.match(css, /@media\(max-width:700px\)/);
  assert.match(css, /safe-area-inset-bottom/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(mark, /<svg/);
  assert.match(mark, /VOLTURA/);
  assert.ok(fs.statSync(path.join(root, 'icons/icon-192.png')).size > 1000);
  assert.ok(fs.statSync(path.join(root, 'icons/icon-512.png')).size > 1000);
});

test('service worker cache version and update checks are advanced', () => {
  const worker = read('sw.js'), app = read('app.js');
  assert.match(worker, /voltura-platform-v21\.0/);
  assert.match(worker, /'polish\.css'/);
  assert.match(app, /updateViaCache:'none'/);
  assert.match(app, /registration\.update\(\)/);
});


test('brand icon assets and manifest theme color match the refreshed identity', () => {
  const manifest = JSON.parse(read('manifest.webmanifest'));
  assert.equal(manifest.theme_color.toLowerCase(), '#d8ff3f');
  for (const size of [192, 512]) {
    for (const suffix of ['', '-maskable']) {
      const file = path.join(root, `icons/icon-${size}${suffix}.png`);
      assert.ok(fs.existsSync(file), `missing refreshed icon ${file}`);
      assert.ok(fs.statSync(file).size > 1000, `icon appears unexpectedly small: ${file}`);
    }
  }
});

test('chapter progress rail has a single responsive width source and no fixed-width conflict', () => {
  const motion = read('motion-ui.css');
  const polish = read('polish.css');
  assert.doesNotMatch(motion, /\.scroll-chapter-progress\s*\{/);
  assert.match(polish, /\.scroll-chapter-progress\s*\{[^}]*width:auto/s);
  assert.match(polish, /@media\(max-width:700px\)[\s\S]*?\.scroll-chapter-nav\s*\{[^}]*width:100%/s);
});

test('all buttons declare an explicit type and SVG viewBox attributes use canonical casing', () => {
  const html = read('index.html');
  const buttons = [...html.matchAll(/<button\b([^>]*)>/gi)];
  assert.ok(buttons.length > 0);
  for (const [, attrs] of buttons) assert.match(attrs, /\stype\s*=\s*["'](?:button|submit|reset)["']/i, `button missing explicit type: ${attrs}`);
  assert.doesNotMatch(html, /<svg\b[^>]*\sviewbox=/);
});

test('current app, worker and source labels agree on the release version', () => {
  assert.match(read('index.html'), /class="version-tag">V21\.0</);
  assert.match(read('sw.js'), /voltura-platform-v21\.0/);
  assert.match(read('app.js'), /VOLTURA v21\.0/);
  assert.match(read('design-system.css'), /visual system — v21\.0/);
});


test('dashboard masthead, balance hero and detail row have explicit responsive layout rules', () => {
  const html = read('index.html'), css = read('polish.css');
  assert.match(html, /class="dashboard-masthead"/);
  assert.match(html, /class="balance-detail-row"/);
  assert.doesNotMatch(html, /class="prism-stage"/);
  assert.match(css, /\.dashboard-masthead\s*\{/);
  assert.match(css, /\.balance-detail-row\s*\{/);
  assert.match(css, /@media\(max-width:700px\)[\s\S]*?\.dashboard-masthead\s*\{display:block/s);
});

test('primary balance value and insight copy meet the intended high-contrast surfaces', () => {
  const css = read('polish.css');
  assert.match(css, /\.balance-main \.balance-value\{color:#17201D!important/);
  assert.match(css, /\.balance-main \.metric-label[^}]*color:#253128!important/);
  assert.match(css, /\.insight-feature \.feature-link\{color:#D8FF3F!important/);
  assert.match(css, /\.insight-feature p:not\(\.eyebrow\)\{color:#D1DAD3!important/);
});

test('accessible cash-flow data table does not use a long intrinsic-width caption', () => {
  const html = read('index.html'), css = read('polish.css');
  assert.match(html, /<table aria-label="Monthly income and expense chart data in Indian rupees" class="sr-only"/);
  assert.doesNotMatch(html, /<table[^>]*id="cashflowChartData"[^>]*>\s*<caption/);
  assert.match(css, /#cashflowChartData\{width:1px!important/);
});

test('theme-color follows the selected appearance and chapter progress follows scroll position', () => {
  const app = read('app.js'), story = read('scroll-story.js');
  assert.match(app, /themeMeta\.content=dark\?'#101715':'#F3F3ED'/);
  assert.match(story, /const start=rect\.top\+scrollY/);
  assert.match(story, /fill\.style\.width=`\$\{progress\*100\}%`/);
});


test('sidebar brand wordmark remains readable in both light and dark themes', () => {
  const css = read('polish.css');
  assert.match(css, /\.brand-word\{color:var\(--color-text\)!important/);
  assert.match(css, /\.brand-word small\{[^}]*color:var\(--color-text-muted\)!important/);
});


test('passive trackpad sensing drives a subtle chapter-nav tilt and resets without hijacking scroll', () => {
  const js = read('motion-ui.js'), css = read('polish.css'), motionCss = read('motion-ui.css');
  assert.match(js, /addEventListener\('wheel'/);
  assert.match(js, /wheelReset=setTimeout/);
  assert.match(js, /addEventListener\('wheel',[\s\S]*?\{passive:true\}/);
  assert.match(css, /rotateX\(var\(--gesture-y,0deg\)\) rotateY\(var\(--gesture-x,0deg\)\)/);
  assert.doesNotMatch(js, /motion-ambient|--pointer-x|--chart-pointer|--shine-x|--shine-y/);
  assert.equal((js.match(/querySelectorAll\('\.balance-hero,\.insight-feature'\)/g)||[]).length,1,'3D tilt listeners are attached once');
  assert.doesNotMatch(motionCss, /motion-ambient/);
});


test('V21 redesign stylesheet is linked, precached, responsive and presentation-only', () => {
  const html = read('index.html'), worker = read('sw.js'), css = read('voltura-redesign.css');
  assert.match(html, /href="\.\/voltura-redesign\.css"/);
  assert.match(worker, /'voltura-redesign\.css'/);
  assert.match(css, /@media\(max-width:700px\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(css, /https?:\/\//);
  assert.match(css, /--vr-forest/);
});
