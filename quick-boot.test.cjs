const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, 'quick-boot.js'), 'utf8');

function harness(search, readyState = 'loading') {
  const classes = new Set();
  const events = {};
  const elements = {
    quickExpenseDialog: { open: false, shown: 0, showModal() { this.open = true; this.shown++; } },
    entryDialog: { open: false, shown: 0, showModal() { this.open = true; this.shown++; } },
    quickExpenseSave: { disabled: false },
    quickFeedback: { textContent: '' },
    quickExpenseFields: { hidden: false },
    quickExpenseLoading: { hidden: true },
    entryAmount: { },
    entryType: { value: 'expense' },
    entryDialogTitle: { textContent: 'New transaction' },
    entryLaunchLoading: { hidden: true }
  };
  const tabs = ['expense','income','transfer'].map(type => ({ dataset: { type }, active: type === 'expense', classList: { toggle(name, value) { if(name==='active')this.owner.active=value; }, owner: null } }));
  tabs.forEach(tab => { tab.classList.owner = tab; });
  let state = readyState;
  const document = {
    get readyState() { return state; },
    documentElement: { classList: { add(value) { classes.add(value); }, remove(value) { classes.delete(value); } } },
    getElementById(id) { return elements[id] || null; },
    querySelector(selector) { if(selector === '#entryForm button[type="submit"]') return elements.entrySubmit; return null; },
    querySelectorAll(selector) { return selector === '.type-tab' ? tabs : []; },
    addEventListener(name, callback) { events[name] = callback; }
  };
  elements.entrySubmit = { disabled: false };
  const window = {};
  vm.runInNewContext(source, { URLSearchParams, location: { search }, window, document, console });
  return { classes, events, elements, tabs, window, setReady(value) { state = value; } };
}

test('expense NFC route opens focused capture before app initialization and blocks premature save', () => {
  const h = harness('?a=1');
  assert.equal(h.classes.has('nfc-launch'), true);
  assert.equal(h.window.__volturaLaunchIntent.type, 'expense');
  assert.equal(h.elements.quickExpenseSave.disabled, false);
  h.setReady('interactive'); h.events.readystatechange();
  assert.equal(h.elements.quickExpenseDialog.shown, 1);
  assert.equal(h.elements.quickExpenseSave.disabled, true);
  assert.equal(h.elements.quickExpenseFields.hidden, true);
  assert.equal(h.elements.quickExpenseLoading.hidden, false);
});

test('income NFC route opens income dialog first and presents the correct transaction type', () => {
  const h = harness('?i=1');
  h.setReady('interactive'); h.events.readystatechange();
  assert.equal(h.window.__volturaLaunchIntent.type, 'income');
  assert.equal(h.elements.entryDialog.shown, 1);
  assert.equal(h.elements.entrySubmit.disabled, true);
  assert.equal(h.elements.entryType.value, 'income');
  assert.equal(h.elements.entryDialogTitle.textContent, 'Record income');
  assert.equal(h.elements.entryLaunchLoading.hidden, false);
  assert.equal(h.tabs.find(tab => tab.dataset.type === 'income').active, true);
});

test('ordinary dashboard visit does not open a dialog or alter page visibility', () => {
  const h = harness('');
  assert.equal(h.classes.has('nfc-launch'), false);
  assert.equal(h.window.__volturaLaunchIntent, undefined);
  assert.equal(h.events.readystatechange, undefined);
  assert.equal(h.elements.quickExpenseDialog.shown, 0);
  assert.equal(h.elements.entryDialog.shown, 0);
});

test('quick boot is loaded before the single runtime stylesheet and dialogs start in a safe loading state', () => {
  const html=fs.readFileSync(require('node:path').join(__dirname,'index.html'),'utf8');
  assert.equal((html.match(/src="\.\/quick-boot\.js"/g)||[]).length,1);
  assert.ok(html.indexOf('src="./quick-boot.js"') < html.indexOf('href="./voltura.css"'));
  assert.match(html, /id="quickExpenseFields" hidden/);
  assert.match(html, /id="quickExpenseLoading" role="status"/);
  assert.match(html, /id="entryLaunchLoading"[^>]*role="status"[^>]*hidden/);
  assert.match(html, /<span class="version-tag">V26[.]2<\/span>/);
});
