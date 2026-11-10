/* Parser-time NFC shortcut opener. Loaded after the entry dialogs and before app.js. */
(() => {
  'use strict';
  const params = new URLSearchParams(window.location.search);
  const action = params.get('a') === '1' || params.get('add') === '1' ? 'expense' : params.get('i') === '1' ? 'income' : '';
  if (!action) return;
  const expense = action === 'expense';
  const dialog = document.getElementById(expense ? 'quickExpenseDialog' : 'entryDialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const form = document.getElementById(expense ? 'quickExpenseForm' : 'entryForm');
  const save = expense ? document.getElementById('quickExpenseSave') : form?.querySelector('button[type=\"submit\"]');
  if (form) {
    form.dataset.ready = 'false';
    form.addEventListener('submit', event => {
      if (form.dataset.ready !== 'true') event.preventDefault();
    });
  }
  if (save) save.disabled = true;
  dialog._returnFocusTarget = document.getElementById('main-content') || document.body;
  try { dialog.showModal(); } catch { return; }
  const input = document.getElementById(expense ? 'quickExpenseAmount' : 'entryAmount');
  const date = document.getElementById(expense ? 'quickExpenseDateTime' : 'entryDate');
  if (date && !date.value) {
    const now = new Date();
    const pad = value => String(value).padStart(2, '0');
    date.value = expense
      ? `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`
      : `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  }
  input?.focus({ preventScroll: true });
})();
