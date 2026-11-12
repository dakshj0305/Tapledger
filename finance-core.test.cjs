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
