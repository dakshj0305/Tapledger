/* Early, non-visual shortcut intent capture. The app opens the sheet once IndexedDB and handlers are ready. */
(() => {
  'use strict';
  const params = new URLSearchParams(window.location.search);
  const type = params.get('a') === '1' || params.get('add') === '1' ? 'expense' : params.get('i') === '1' ? 'income' : '';
  if (type) window.__volturaLaunchIntent = Object.freeze({ type, source: 'nfc' });
})();
