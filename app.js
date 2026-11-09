'use strict';

const DB_NAME = 'tapledger-db';
const DB_VERSION = 1;
const CURRENCY = 'INR';
const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Education', 'Entertainment', 'Other'];
const CATEGORY_META = {
  Food: { icon: '🍜' }, Transport: { icon: '🚕' }, Shopping: { icon: '🛍️' },
  Bills: { icon: '🧾' }, Health: { icon: '💊' }, Education: { icon: '📚' },
  Entertainment: { icon: '🎬' }, Other: { icon: '✦' }
};

let db;
let expenses = [];
let monthlyBudgetPaise = 0;
let toastTimer;

const $ = (selector) => document.querySelector(selector);
const expenseDialog = $('#expenseDialog');
const expenseForm = $('#expenseForm');

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains('expenses')) {
        const store = database.createObjectStore('expenses', { keyPath: 'id' });
        store.createIndex('spentAt', 'spentAt', { unique: false });
        store.createIndex('category', 'category', { unique: false });
      }
      if (!database.objectStoreNames.contains('settings')) database.createObjectStore('settings', { keyPath: 'key' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Could not open local database.'));
  });
}

function storeRequest(storeName, mode, action) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    let req;
    try { req = action(store); } catch (error) { reject(error); return; }
    tx.oncomplete = () => resolve(req ? req.result : undefined);
    tx.onerror = () => reject(tx.error || new Error('Database transaction failed.'));
    tx.onabort = () => reject(tx.error || new Error('Database transaction was cancelled.'));
  });
}

const getAllExpenses = () => storeRequest('expenses', 'readonly', store => store.getAll());
const putExpense = expense => storeRequest('expenses', 'readwrite', store => store.put(expense));
const deleteExpense = id => storeRequest('expenses', 'readwrite', store => store.delete(id));
const getSetting = key => storeRequest('settings', 'readonly', store => store.get(key));
const putSetting = item => storeRequest('settings', 'readwrite', store => store.put(item));

function money(paise) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: CURRENCY, maximumFractionDigits: 2 }).format((paise || 0) / 100);
}
function rupeesToPaise(value) { return Math.round(Number(value) * 100); }
function localDateString(date = new Date()) {
  const y = date.getFullYear(); const m = String(date.getMonth() + 1).padStart(2, '0'); const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
function parseLocalDate(dateString) { return new Date(`${dateString}T12:00:00`); }
function monthKey(dateString) { return dateString.slice(0, 7); }
function currentMonthKey() { return localDateString().slice(0, 7); }
function formatDate(dateString) { return parseLocalDate(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}
function showToast(message) {
  const toast = $('#toast'); toast.textContent = message; toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function currentMonthExpenses() { const key = currentMonthKey(); return expenses.filter(item => monthKey(item.spentAt) === key); }

function render() {
  const monthItems = currentMonthExpenses();
  const total = monthItems.reduce((sum, item) => sum + item.amountPaise, 0);
  $('#monthLabel').textContent = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  $('#monthTotal').textContent = money(total);
  $('#monthCount').textContent = String(monthItems.length);
  const fill = monthlyBudgetPaise > 0 ? Math.min(100, (total / monthlyBudgetPaise) * 100) : 0;
  $('#budgetFill').style.width = `${fill}%`;
  $('#budgetCaption').textContent = monthlyBudgetPaise > 0 ? `${money(total)} of ${money(monthlyBudgetPaise)} used · ${Math.max(0, 100 - fill).toFixed(0)}% left` : 'No monthly budget set';
  $('#budgetButton').textContent = monthlyBudgetPaise > 0 ? 'Edit budget' : 'Set budget';
  renderWeeklyChart(); renderCategories(); renderExpenseList();
}

function renderWeeklyChart() {
  const host = $('#weeklyChart');
  const days = [];
  for (let offset = 6; offset >= 0; offset--) {
    const date = new Date(); date.setDate(date.getDate() - offset);
    const key = localDateString(date);
    const total = expenses.filter(item => item.spentAt === key).reduce((sum, item) => sum + item.amountPaise, 0);
    days.push({ key, label: date.toLocaleDateString('en-IN', { weekday: 'short' }), total });
  }
  const max = Math.max(...days.map(day => day.total), 100);
  host.innerHTML = days.map(day => {
    const height = day.total ? Math.max(5, (day.total / max) * 100) : 3;
    return `<div class="day-column" title="${escapeHtml(day.key)}: ${money(day.total)}"><span class="day-amount">${day.total ? money(day.total).replace('₹', '₹') : '—'}</span><div class="day-bar-wrap"><div class="day-bar" style="height:${height}%"></div></div><span class="day-label">${day.label}</span></div>`;
  }).join('');
}

function renderCategories() {
  const host = $('#categoryBreakdown');
  const monthItems = currentMonthExpenses();
  const totals = new Map();
  monthItems.forEach(item => totals.set(item.category, (totals.get(item.category) || 0) + item.amountPaise));
  const entries = [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  if (!entries.length) { host.innerHTML = '<p class="empty-note">Your category totals will appear here.</p>'; return; }
  const max = entries[0][1] || 1;
  host.innerHTML = entries.map(([category, amount]) => `<div class="category-row"><span class="category-name">${CATEGORY_META[category]?.icon || '✦'} ${escapeHtml(category)}</span><span class="category-track"><span style="width:${(amount / max) * 100}%"></span></span><span class="category-value">${money(amount)}</span></div>`).join('');
}

function renderExpenseList() {
  const host = $('#expenseList');
  const filter = $('#categoryFilter').value;
  const visible = [...expenses].sort((a, b) => b.spentAt.localeCompare(a.spentAt) || b.createdAt.localeCompare(a.createdAt)).filter(item => filter === 'all' || item.category === filter).slice(0, 60);
  if (!visible.length) {
    host.innerHTML = `<div class="empty-state"><span>✦</span><strong>${expenses.length ? 'No matching expenses' : 'No expenses yet'}</strong><p>${expenses.length ? 'Try another category filter.' : 'Tap your NFC card or add your first expense.'}</p></div>`;
    return;
  }
  host.innerHTML = visible.map(item => `<article class="expense-item"><div class="expense-icon">${CATEGORY_META[item.category]?.icon || '✦'}</div><div class="expense-main"><div class="expense-title">${escapeHtml(item.merchant || item.category)}</div><div class="expense-sub">${escapeHtml(item.category)} · ${formatDate(item.spentAt)}${item.source === 'nfc' ? ' · NFC' : ''}${item.note ? ` · ${escapeHtml(item.note)}` : ''}</div></div><div class="expense-amount">−${money(item.amountPaise)}</div><button class="delete-expense" type="button" data-delete="${escapeHtml(item.id)}" aria-label="Delete expense">×</button></article>`).join('');
}

function openExpenseDialog(options = {}) {
  $('#expenseForm').reset();
  $('#spentAt').value = localDateString();
  $('#category').value = CATEGORIES.includes(options.category) ? options.category : 'Food';
  $('#merchant').value = options.merchant || '';
  $('#captureHint').textContent = options.source === 'nfc' ? 'NFC tap detected · Add the amount to save this purchase.' : 'Add the amount and a few details.';
  expenseDialog.showModal();
  setTimeout(() => $('#amount').focus(), 100);
}

function readLaunchParameters() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('add') === '1') {
    const options = {
      source: params.get('source') === 'nfc' ? 'nfc' : 'manual',
      category: params.get('category') || 'Food',
      merchant: params.get('merchant') || ''
    };
    // Remove the one-shot command so a refresh does not reopen the form.
    window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
    openExpenseDialog(options);
  }
}

async function handleSave(event) {
  event.preventDefault();
  const amount = rupeesToPaise($('#amount').value);
  const category = $('#category').value;
  const spentAt = $('#spentAt').value;
  if (!Number.isSafeInteger(amount) || amount <= 0) { showToast('Enter an amount greater than ₹0.'); $('#amount').focus(); return; }
  if (!CATEGORIES.includes(category) || !/^\d{4}-\d{2}-\d{2}$/.test(spentAt)) { showToast('Check the category and date.'); return; }
  const urlParams = new URLSearchParams(window.location.search);
  const source = $('#captureHint').textContent.startsWith('NFC tap') ? 'nfc' : 'manual';
  const item = {
    id: (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`),
    amountPaise: amount,
    currency: CURRENCY,
    category,
    merchant: $('#merchant').value.trim(),
    note: $('#note').value.trim(),
    spentAt,
    createdAt: new Date().toISOString(),
    source
  };
  try {
    await putExpense(item);
    expenses.push(item);
    expenseDialog.close(); render(); showToast(`Saved ${money(amount)}.`);
  } catch (error) { console.error(error); showToast('Could not save. Check browser storage permissions.'); }
}

function csvSafe(value) {
  let text = String(value ?? '');
  if (/^[\s\u0000-\u001f]*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob); const anchor = document.createElement('a');
  anchor.href = url; anchor.download = filename; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function exportCsv() {
  const rows = [['Date', 'Amount INR', 'Category', 'Merchant', 'Note', 'Source', 'ID']];
  [...expenses].sort((a, b) => a.spentAt.localeCompare(b.spentAt)).forEach(item => rows.push([
    item.spentAt, (item.amountPaise / 100).toFixed(2), item.category, item.merchant, item.note, item.source, item.id
  ]));
  const csv = '\uFEFF' + rows.map(row => row.map(csvSafe).join(',')).join('\r\n');
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), `tapledger-${localDateString()}.csv`);
  showToast('CSV export prepared.');
}
function backupJson() {
  const backup = { app: 'TapLedger', schemaVersion: 1, exportedAt: new Date().toISOString(), currency: CURRENCY, monthlyBudgetPaise, expenses };
  downloadBlob(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }), `tapledger-backup-${localDateString()}.json`);
  showToast('Backup file prepared.');
}
function isValidExpense(item) {
  return item && typeof item.id === 'string' && Number.isSafeInteger(item.amountPaise) && item.amountPaise > 0 &&
    CATEGORIES.includes(item.category) && typeof item.spentAt === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.spentAt);
}
async function restoreJson(file) {
  if (!file) return;
  try {
    if (file.size > 10 * 1024 * 1024) throw new Error('Backup is larger than 10 MB.');
    const data = JSON.parse(await file.text());
    if (!data || data.app !== 'TapLedger' || !Array.isArray(data.expenses)) throw new Error('This is not a TapLedger backup.');
    const valid = data.expenses.filter(isValidExpense).map(item => ({
      id: item.id, amountPaise: item.amountPaise, currency: CURRENCY, category: item.category,
      merchant: String(item.merchant || '').slice(0, 80), note: String(item.note || '').slice(0, 160),
      spentAt: item.spentAt, createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
      source: item.source === 'nfc' ? 'nfc' : 'manual'
    }));
    if (!valid.length && data.expenses.length) throw new Error('No valid expense records were found.');
    for (const item of valid) await putExpense(item);
    if (Number.isSafeInteger(data.monthlyBudgetPaise) && data.monthlyBudgetPaise >= 0) {
      monthlyBudgetPaise = data.monthlyBudgetPaise; await putSetting({ key: 'monthlyBudgetPaise', value: monthlyBudgetPaise });
    }
    expenses = await getAllExpenses(); render(); showToast(`Restored or merged ${valid.length} records.`);
  } catch (error) { showToast(error.message || 'Could not restore that file.'); }
  finally { $('#restoreFile').value = ''; }
}

async function setBudget() {
  const current = monthlyBudgetPaise ? (monthlyBudgetPaise / 100).toFixed(2) : '';
  const answer = window.prompt('Set your monthly spending budget in ₹. Enter 0 to clear it.', current);
  if (answer === null) return;
  const value = Number(answer);
  if (!Number.isFinite(value) || value < 0 || value > 100000000) { showToast('Enter a valid budget amount.'); return; }
  monthlyBudgetPaise = rupeesToPaise(value);
  await putSetting({ key: 'monthlyBudgetPaise', value: monthlyBudgetPaise });
  render(); showToast(monthlyBudgetPaise ? 'Monthly budget updated.' : 'Monthly budget cleared.');
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js').catch(error => console.warn('Service worker registration failed:', error));
  }
}

async function init() {
  try {
    if (!('indexedDB' in window)) throw new Error('This browser does not support local database storage.');
    db = await openDatabase();
    expenses = await getAllExpenses();
    const savedBudget = await getSetting('monthlyBudgetPaise');
    monthlyBudgetPaise = Number.isSafeInteger(savedBudget?.value) ? savedBudget.value : 0;
    render();
    registerServiceWorker();
    readLaunchParameters();
  } catch (error) {
    console.error(error);
    showToast('TapLedger could not start. Open it in current Chrome and allow site storage.');
  }
}

$('#addButton').addEventListener('click', () => openExpenseDialog());
$('#closeDialog').addEventListener('click', () => expenseDialog.close());
$('#cancelExpense').addEventListener('click', () => expenseDialog.close());
expenseForm.addEventListener('submit', handleSave);
$('#budgetButton').addEventListener('click', setBudget);
$('#categoryFilter').addEventListener('change', renderExpenseList);
$('#exportCsv').addEventListener('click', exportCsv);
$('#backupJson').addEventListener('click', backupJson);
$('#restoreJson').addEventListener('click', () => $('#restoreFile').click());
$('#restoreFile').addEventListener('change', event => restoreJson(event.target.files?.[0]));
document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => openExpenseDialog({ category: button.dataset.category })));
$('#expenseList').addEventListener('click', async event => {
  const button = event.target.closest('[data-delete]');
  if (!button) return;
  const item = expenses.find(expense => expense.id === button.dataset.delete);
  if (!item || !window.confirm(`Delete this ${money(item.amountPaise)} expense?`)) return;
  try { await deleteExpense(item.id); expenses = expenses.filter(expense => expense.id !== item.id); render(); showToast('Expense deleted.'); }
  catch (error) { console.error(error); showToast('Could not delete that expense.'); }
});

init();
