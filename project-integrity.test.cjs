const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname);
const read = name => fs.readFileSync(path.join(root, name), 'utf8');

test('static assets resolve from the GitHub Pages project root', () => {
  const html = read('index.html');
  const refs = [...html.matchAll(/(?:src|href)="\.\/([^"?#]+)"/g)].map(match => match[1]);
  for (const ref of refs) assert.ok(fs.existsSync(path.join(root, ref)), `missing local asset: ${ref}`);
  const manifest = JSON.parse(read('manifest.webmanifest'));
  assert.equal(manifest.start_url, './');
  assert.equal(manifest.scope, './');
  assert.ok(manifest.shortcuts.some(item => item.url === './?a=1'));
  assert.ok(manifest.shortcuts.some(item => item.url === './?i=1'));
});

test('IndexedDB identity and schema remain unchanged', () => {
  const app = read('app.js');
  assert.match(app, /DB_NAME\s*=\s*'tapledger-db'/);
  assert.match(app, /DB_VERSION\s*=\s*3/);
  for (const store of ['expenses','settings','transactions','budgets','goals','accounts']) {
    assert.ok(app.includes(`createObjectStore('${store}'`), `missing existing store ${store}`);
  }
  assert.match(app, /createIndex\('date','date'\)/);
  assert.match(app, /createIndex\('type','type'\)/);
  assert.match(app, /createIndex\('category','category'\)/);
});

test('new payment method remains optional and legacy backup tags are accepted', () => {
  const app = read('app.js');
  assert.match(app, /t\.paymentMethod!==undefined/);
  assert.match(app, /paymentMethod:String\(t\.paymentMethod\|\|''\)/);
  for (const tag of ['Voltura','Vellum','Cairn','TapLedger']) assert.ok(app.includes(`'${tag}'`));
  assert.match(app, /app:'Voltura'/);
  assert.match(app, /await batchWrite\(\['transactions','budgets','goals','accounts'\],ops\)/);
});

test('quick launch, local enhancement, and offline shell are wired without external requests', () => {
  const html = read('index.html'), boot = read('quick-boot.js'), app = read('app.js'), worker = read('sw.js');
  assert.match(boot, /params\.get\('a'\).*'expense'/s);
  assert.match(boot, /params\.get\('i'\).*'income'/s);
  assert.match(boot, /input\?\.focus/);
  assert.match(app, /history\.replaceState/);
  assert.match(app, /function handleEntrySubmit/);
  assert.match(app, /async function saveQuickExpense/);
  assert.match(app, /async function undoQuickExpense/);
  assert.match(app, /function applyMerchantSuggestion/);
  assert.match(app, /detectUnusualExpenses/);
  assert.match(app, /function renderMonthlyReport/);
  assert.match(app, /function exportReportCSV/);
  assert.ok(worker.includes("'finance-core.js'"));
  assert.ok(worker.includes("'motion-ui.css'"));
  assert.ok(worker.includes("'motion-ui.js'"));
  assert.match(worker, /if\(url\.origin!==self\.location\.origin\)return/);
  assert.doesNotMatch(html, /<script[^>]+src="https?:/i);
  assert.doesNotMatch(html, /<link[^>]+href="https?:[^\"]+stylesheet/i);
  assert.doesNotMatch(app, /fetch\(\s*['"]https?:/i);
});

test('stylesheets have balanced blocks and no remote imports', () => {
  for (const name of ['style.css','design-system.css','legal.css']) {
    const css = read(name);
    assert.equal((css.match(/{/g)||[]).length, (css.match(/}/g)||[]).length, `${name} brace balance`);
    assert.doesNotMatch(css, /@import\s+url\(['"]?https?:/i, `${name} remote import`);
  }
});

test('HTML IDs used directly by the app exist and IDs are unique', () => {
  const html = read('index.html'), app = read('app.js');
  const all = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]);
  assert.equal(new Set(all).size, all.length, 'duplicate HTML id');
  const ids = new Set(all);
  const dynamic = new Set(['firstBudgetButton','firstGoalButton']);
  const used = [...new Set([...app.matchAll(/\$\(['"]#([^'"]+)['"]\)/g)].map(match => match[1]))];
  for (const id of used) if (!dynamic.has(id)) assert.ok(ids.has(id), `missing app element #${id}`);
});
