const test = require('node:test');
const assert = require('node:assert/strict');
require('./finance-core.js');
const finance = globalThis.VolturaFinance;

const expense = (id, date, amountPaise, category = 'Food', merchant = 'Cafe North') => ({ id, type: 'expense', date, amountPaise, category, merchant });

test('budget states change at 80 and 100 percent without rounding the boundary', () => {
  assert.equal(finance.budgetStatus(7999, 10000), 'within');
  assert.equal(finance.budgetStatus(8000, 10000), 'warning');
  assert.equal(finance.budgetStatus(9999, 10000), 'warning');
  assert.equal(finance.budgetStatus(10000, 10000), 'exceeded');
  assert.equal(finance.budgetStatus(0, 0), 'unset');
});

test('merchant suggestion prefers the matching local merchant history', () => {
  const ledger = [
    expense('1', '2025-01-01', 500, 'Transport', 'Cafe North'),
    expense('2', '2025-02-01', 700, 'Transport', ' cafe   north '),
    expense('3', '2025-03-01', 600, 'Food', 'Cafe North')
  ];
  assert.equal(finance.suggestMerchantCategory('Cafe North', ledger), 'Transport');
  assert.equal(finance.suggestMerchantCategory('Zomato', []), 'Food');
  assert.equal(finance.suggestMerchantCategory('Unlisted shop', []), '');
});

test('unusual spending needs five earlier same-category records in the rolling 12 months', () => {
  const five = Array.from({ length: 5 }, (_, i) => expense(String(i), `2025-0${i + 1}-10`, 1000));
  const signal = expense('signal', '2025-06-10', 1501);
  const exactThreshold = expense('threshold', '2025-07-10', 1500);
  const results = finance.detectUnusualExpenses([...five, signal, exactThreshold]);
  assert.deepEqual(results.map(item => item.transaction.id), ['signal']);
  assert.equal(results[0].averagePaise, 1000);
  assert.equal(results[0].priorCount, 5);
  assert.deepEqual(finance.detectUnusualExpenses([...five.slice(0, 4), signal]), []);
});

test('unusual spending ignores category peers older than twelve months', () => {
  const stale = Array.from({ length: 5 }, (_, i) => expense(String(i), `2023-0${i + 1}-01`, 1000));
  const recent = Array.from({ length: 4 }, (_, i) => expense(`r${i}`, `2024-0${i + 9}-01`, 1000));
  const candidate = expense('candidate', '2025-01-02', 3000);
  assert.deepEqual(finance.detectUnusualExpenses([...stale, ...recent, candidate]), []);
});

test('weekly spending is grouped into calendar weeks and excludes income', () => {
  const rows = [expense('a', '2025-01-01', 100), expense('b', '2025-01-05', 200), expense('c', '2025-01-06', 300), { id: 'income', type: 'income', date: '2025-01-07', amountPaise: 9000, category: 'Salary' }];
  const weeks = finance.weeklyExpenseSummary(rows, '2025-01');
  assert.deepEqual(weeks.slice(0, 2), [{ startDay: 1, endDay: 5, totalPaise: 300 }, { startDay: 6, endDay: 12, totalPaise: 300 }]);
  assert.equal(weeks.reduce((sum, week) => sum + week.totalPaise, 0), 600);
});

test('additive restore planner preserves existing IDs and rejects duplicate incoming IDs', () => {
  const existing = [{ id: 'same', amountPaise: 100 }];
  const incoming = [
    { id: 'same', amountPaise: 999 },
    { id: 'new', amountPaise: 200 },
    { id: 'new', amountPaise: 300 },
    { id: 'newer', amountPaise: 400 }
  ];
  const plan = VolturaFinance.planAdditiveRecords(existing, incoming, item => item.id);
  assert.deepEqual(plan.additions.map(item => item.id), ['new', 'newer']);
  assert.equal(plan.conflicts, 1);
  assert.equal(plan.duplicates, 1);
  assert.equal(existing[0].amountPaise, 100);
  assert.equal(incoming[0].amountPaise, 999);
});

test('budget status validates inputs and avoids floating-point overflow at safe integer limits', () => {
  assert.equal(finance.budgetStatus(-1, 10000), 'unset');
  assert.equal(finance.budgetStatus(Number.MAX_SAFE_INTEGER - 1, Number.MAX_SAFE_INTEGER), 'warning');
  assert.equal(finance.budgetStatus(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER), 'exceeded');
  assert.equal(finance.budgetStatus(1.5, 100), 'unset');
});

test('weekly summary rejects invalid months and ignores malformed or invalid-date records', () => {
  assert.deepEqual(finance.weeklyExpenseSummary([], '2025-13'), []);
  assert.deepEqual(finance.weeklyExpenseSummary([], 'not-a-month'), []);
  const rows = [
    expense('valid', '2025-02-03', 100),
    expense('invalid-date', '2025-02-31', 900),
    expense('invalid-amount', '2025-02-04', Number.MAX_SAFE_INTEGER + 1),
    expense('negative', '2025-02-05', -1)
  ];
  assert.equal(finance.weeklyExpenseSummary(rows, '2025-02').reduce((sum, week) => sum + week.totalPaise, 0), 100);
});

test('weekly summary fails explicitly instead of silently corrupting totals beyond safe integer precision', () => {
  const rows = [
    expense('large-a', '2025-01-02', Number.MAX_SAFE_INTEGER),
    expense('large-b', '2025-01-03', 1)
  ];
  assert.throws(() => finance.weeklyExpenseSummary(rows, '2025-01'), RangeError);
});

test('unusual expense detector rejects impossible calendar dates', () => {
  const history = Array.from({ length: 5 }, (_, i) => expense(String(i), `2025-0${i + 1}-10`, 1000));
  const impossible = expense('impossible', '2025-02-30', 5000);
  assert.deepEqual(finance.detectUnusualExpenses([...history, impossible]), []);
});
