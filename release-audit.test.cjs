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
  const css = read('voltura.css');
  const mark = read('icons/voltura-mark.svg');
  assert.match(html, /href="\.\/voltura\.css"/);
  assert.match(html, /class="editorial-ticker"/);
  assert.match(html, /dashboard-art-direction\.css/);
  assert.doesNotMatch(html, /class="cinematic-intro"/);
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
  assert.match(worker, /voltura-platform-v26\.0\.2/);
  assert.match(worker, /'voltura\.css'/);
  assert.match(app, /updateViaCache:'none'/);
  assert.match(app, /registration\.update\(\)/);
});


test('brand icon assets and manifest theme color match the refreshed identity', () => {
  const manifest = JSON.parse(read('manifest.webmanifest'));
  assert.equal(manifest.theme_color.toLowerCase(), '#173d2d');
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
  assert.match(read('index.html'), /data-build-id="VOLTURA-26\.0-UNIFIED-20261113"/);
  assert.match(read('sw.js'), /voltura-platform-v26\.0\.2/);
  assert.match(read('app.js'), /VOLTURA v26\.0/);
  assert.match(read('voltura-visual-overhaul.css'), /VOLTURA V22/);
});


test('dashboard masthead, balance hero and detail row have explicit responsive layout rules', () => {
  const html = read('index.html'), css = read('voltura.css');
  assert.match(html, /class="dashboard-masthead"/);
  assert.match(html, /class="balance-detail-row"/);
  assert.doesNotMatch(html, /class="prism-stage"/);
  assert.match(css, /\.dashboard-masthead\s*\{/);
  assert.match(css, /\.balance-detail-row\s*\{/);
  assert.match(css, /@media\(max-width:700px\)[\s\S]*?\.dashboard-masthead\s*\{display:block/s);
});

test('primary balance value and insight copy meet the intended high-contrast surfaces', () => {
  const css = read('voltura.css');
  assert.match(css, /\.balance-value\{font:700 clamp/);
  assert.match(css, /\.balance-hero \.metric-label[^}]*color:#c4d0c5!important/);
  assert.match(css, /\.insight-feature \.feature-link[^}]*color:var\(--v26-pine\)!important/);
  assert.match(css, /\.insight-feature h3[^}]*color:var\(--v26-ink\)!important/);
});

test('accessible cash-flow data table does not use a long intrinsic-width caption', () => {
  const html = read('index.html'), css = read('voltura.css');
  assert.match(html, /<table aria-label="Monthly income and expense chart data in Indian rupees" class="sr-only"/);
  assert.doesNotMatch(html, /<table[^>]*id="cashflowChartData"[^>]*>\s*<caption/);
  assert.match(css, /#cashflowChartData\{width:1px!important/);
});

test('theme-color follows the selected appearance and chapter progress follows scroll position', () => {
  const app = read('app.js'), story = read('scroll-story.js');
  assert.match(app, /themeMeta\.content=dark\?'#101a15':'#f0eee6'/);
  assert.match(story, /const start=rect\.top\+scrollY/);
  assert.match(story, /fill\.style\.width=`\$\{progress\*100\}%`/);
});


test('sidebar brand wordmark remains readable in both light and dark themes', () => {
  const css = read('voltura.css');
  assert.match(css, /\.brand-word\{color:var\(--color-text\)!important/);
  assert.match(css, /\.brand-word small\{[^}]*color:var\(--color-text-muted\)!important/);
});


test('passive trackpad sensing drives a subtle chapter-nav tilt and resets without hijacking scroll', () => {
  const js = read('motion-ui.js'), css = read('voltura.css'), motionCss = read('motion-ui.css');
  assert.match(js, /addEventListener\('wheel'/);
  assert.match(js, /wheelReset=setTimeout/);
  assert.match(js, /addEventListener\('wheel',[\s\S]*?\{passive:true\}/);
  assert.match(css, /rotateX\(var\(--gesture-y,0deg\)\) rotateY\(var\(--gesture-x,0deg\)\)/);
  assert.doesNotMatch(js, /motion-ambient|--pointer-x|--chart-pointer|--shine-x|--shine-y/);
  assert.equal((js.match(/querySelectorAll\('\.balance-hero,\.insight-feature'\)/g)||[]).length,1,'3D tilt listeners are attached once');
  assert.doesNotMatch(motionCss, /motion-ambient/);
});


test('V26 unified runtime design is self-hosted, matte, responsive and accessible', () => {
  const html=read('index.html'), css=read('voltura.css'), worker=read('sw.js');
  assert.match(html,/href="\.\/voltura\.css"/);
  assert.doesNotMatch(html,/href="\.\/(?:style|design-system|polish|voltura-visual-system|voltura-visual-overhaul|stitch-integration|atelier|vivid-depth)\.css"/);
  assert.match(css,/--v26-paper:#f0eee6/);
  assert.match(css,/--v26-pine-deep:#102c21/);
  assert.match(css,/@media\(max-width:700px\)/);
  assert.match(css,/prefers-reduced-motion/);
  assert.match(css,/forced-colors:active/);
  assert.match(css,/nfc-launch/);
  assert.match(worker,/'voltura\.css'/);
  assert.doesNotMatch(css,/backdrop-filter:blur\(/);
});

test('recent dashboard transactions expose edit and delete through existing handlers', () => {
  const app=read('app.js');
  assert.match(app,/data-recent-edit/);
  assert.match(app,/data-recent-delete/);
  assert.match(app,/\$\('#recentTransactions'\)\.addEventListener\('click'/);
  assert.match(app,/openEntry\(\{item:t\}\)/);
  assert.match(app,/deleteTransaction\(remove\.dataset\.recentDelete\)/);
});

test('legacy migration and account setup do not rewrite existing transaction records', () => {
  const app=read('app.js');
  const migration=app.slice(app.indexOf('async function migrateLegacy'),app.indexOf('async function ensureAccounts'));
  const accounts=app.slice(app.indexOf('async function ensureAccounts'),app.indexOf('async function loadAll'));
  assert.doesNotMatch(migration,/if\(existing\)[\s\S]*?action:'put'/);
  assert.doesNotMatch(accounts,/legacyPatches|Object\.assign\(t/);
  assert.match(app,/const DB_NAME='tapledger-db', DB_VERSION=3/);
});

test('JSON restore is atomic and additive rather than overwriting primary keys', () => {
  const app=read('app.js');
  const restore=app.slice(app.indexOf('function additiveRestore'),app.indexOf('async function clearCurrentMonth'));
  assert.match(restore,/db\.transaction\(stores,'readwrite'\)/);
  assert.match(restore,/VolturaFinance\.planAdditiveRecords/);
  assert.match(restore,/tx\.objectStore\(store\)\.add\(value\)/);
  assert.doesNotMatch(restore,/tx\.objectStore\(store\)\.put\(value\)/);
  assert.match(restore,/toLocaleLowerCase\(\)/);
});

test('mobile navigation retains a persistent central add action and secondary views remain in More', () => {
  const html=read('index.html'), app=read('app.js'), css=read('voltura-visual-system.css');
  assert.match(html,/id="mobileAddButton"/);
  assert.match(app,/\$\('#mobileAddButton'\)\.addEventListener\('click',\(\)=>openEntry\(\)\)/);
  assert.match(html,/id="moreNavDialog"/);
  assert.match(css,/\.nav-item\.mobile-add-button\s*\{[^}]*display:flex/s);
});


test('glass fallbacks follow the final cascade and preserve contrast in reduced-transparency and forced-colors modes', () => {
  const css = read('voltura-visual-system.css');
  const unsupported = css.lastIndexOf('@supports not (backdrop-filter:blur(1px))');
  const reduced = css.lastIndexOf('@media (prefers-reduced-transparency:reduce)');
  const forced = css.lastIndexOf('@media (forced-colors:active)');
  assert.ok(unsupported > css.lastIndexOf('.scroll-chapter-nav { background:var(--v-glass)!important'), 'unsupported-browser fallback follows final glass styling');
  assert.ok(reduced > unsupported, 'reduced-transparency fallback follows unsupported-browser fallback');
  assert.ok(forced > reduced, 'forced-colors has final precedence');
  assert.doesNotMatch(css, /@media\s+not\s*\(backdrop-filter/, 'backdrop support is a @supports query, not an invalid media query');
  assert.match(css.slice(unsupported), /@supports not \(backdrop-filter:blur\(1px\)\)/);
  assert.match(css.slice(unsupported), /\.sidebar\s*\{[^}]*background:#101b16!important;[^}]*color:#eef4e9!important/s);
  assert.match(css.slice(reduced, forced), /\.scroll-chapter-nav\s*\{[^}]*color:var\(--v-ink\)!important/s);
  assert.match(css.slice(forced), /CanvasText!important/);
});


test('unified runtime retains responsive secondary destinations and Stitch-derived structure', () => {
  const css=read('voltura.css'),html=read('index.html'),app=read('app.js');
  assert.match(css,/\.insight-feature/);
  assert.match(css,/@media\(max-width:700px\)/);
  assert.match(html,/data-view="budgets"/);
  assert.match(html,/data-view="goals"/);
  assert.match(app,/view==='budgets'\|\|view==='goals'/);
});

test('Stitch design references are retained while runtime styles are consolidated', () => {
  const html=read('index.html'),worker=read('sw.js'),css=read('voltura.css');
  assert.doesNotMatch(html,/href="\.\/stitch-integration\.css"/);
  assert.match(worker,/'voltura\.css'/);
  assert.match(css,/Source layer: stitch-integration\.css/);
  assert.ok(fs.existsSync(path.join(root,'design-reference/stitch/voltura_overview_dashboard/screen.png')));
});

test('approved dead design assets are removed and Atelier tokens are unified', () => {
  const html=read('index.html'),css=read('voltura.css'),worker=read('sw.js');
  assert.match(html,/href="\.\/voltura\.css"/);
  assert.doesNotMatch(html,/href="\.\/(?:observatory|kinetic|atelier)\.css"/);
  assert.doesNotMatch(html,/src="\.\/vivid-depth\.js"/);
  assert.ok(!fs.existsSync(path.join(root,'observatory.css')));
  assert.ok(!fs.existsSync(path.join(root,'kinetic.css')));
  assert.ok(!fs.existsSync(path.join(root,'vivid-depth.js')));
  assert.match(worker,/'voltura\.css'/);
  assert.match(css,/--atelier-paper:#eeeae1/);
  assert.match(css,/--v26-acid:#d8f36b/);
  assert.match(css,/data-theme=\"dark\"/);
  assert.match(css,/prefers-reduced-motion/);
});


test('Kinetic Relic remains a local progressive enhancement with graceful rendering fallbacks', () => {
  const html=read('index.html'),css=read('voltura.css'),js=read('kinetic.js'),worker=read('sw.js');
  assert.match(html,/src="\.\/kinetic\.js"/);
  assert.match(worker,/'kinetic\.js'/);
  assert.match(css,/perspective/);
  assert.match(css,/prefers-reduced-motion/);
  assert.match(js,/requestAnimationFrame/);
  assert.match(js,/ResizeObserver/);
  assert.match(js,/visibilitychange/);
});


test('V25.2 kinetic enhancements degrade safely without Canvas 2D or ResizeObserver', () => {
  const js=read('kinetic.js');
  assert.match(js,/else canvas\.remove\(\)/);
  assert.doesNotMatch(js,/canvas\.remove\(\);return/);
  assert.match(js,/'ResizeObserver'in window/);
  assert.match(js,/window\.addEventListener\('resize'/);
  assert.match(js,/prefers-reduced-motion/);
});


test('service worker cache namespace is isolated for the hardened update', () => {
  assert.match(read('sw.js'), /const CACHE='voltura-platform-v26\.0\.2'/);
});

test('service worker extends fetch lifetime for cache writes and contains cache-storage failures', () => {
  const worker = read('sw.js');
  assert.match(worker, /event\.waitUntil\(responsePromise\.then\(\(\)=>cacheWrite,\(\)=>undefined\)\)/);
  assert.match(worker, /caches\.open\(CACHE\)\.then\(cache=>cache\.put\(cacheKey,response\.clone\(\)\)\)\.catch\(\(\)=>\{\}\)/);
  assert.match(worker, /return response;/);
});
