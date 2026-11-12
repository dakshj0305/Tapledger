const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('app.js', 'utf8');
const start = source.indexOf('function additiveRestore(stores,incoming){');
const end = source.indexOf('async function restoreJSON(file){', start);
assert.ok(start >= 0 && end > start, 'additive restore helper is present');
const helperSource = source.slice(start, end);

function makeDatabase(seed = {}) {
  const keyPaths = { transactions: 'id', budgets: 'id', goals: 'id', accounts: 'name' };
  const records = Object.fromEntries(Object.keys(keyPaths).map(name => [name, new Map((seed[name] || []).map(row => [String(row[keyPaths[name]]), structuredClone(row)]))]));
  const db = {
    records,
    transaction(names) {
      const tx = { oncomplete: null, onerror: null, onabort: null, aborted: false };
      let reads = 0;
      const finish = () => setTimeout(() => { if (!tx.aborted) tx.oncomplete?.(); }, 0);
      tx.objectStore = name => ({
        getAll() {
          const request = { result: undefined, onsuccess: null, onerror: null };
          reads += 1;
          queueMicrotask(() => {
            request.result = [...records[name].values()].map(row => structuredClone(row));
            request.onsuccess?.();
            if (reads === names.length) finish();
          });
          return request;
        },
        add(value) {
          const key = String(value[keyPaths[name]]);
          if (records[name].has(key)) {
            tx.aborted = true;
            tx.onabort?.();
            throw new Error(`ConstraintError: ${name} ${key}`);
          }
          records[name].set(key, structuredClone(value));
        }
      });
      tx.abort = () => { tx.aborted = true; tx.onabort?.(); };
      return tx;
    }
  };
  return db;
}

function getRestore(db) {
  const finance = {
    planAdditiveRecords(existing, incoming, keyOf) {
      const occupied = new Set(existing.map(item => String(keyOf(item))));
      const seen = new Set();
      const additions = [];
      let conflicts = 0, duplicates = 0;
      for (const item of incoming) {
        const key = String(keyOf(item));
        if (occupied.has(key)) { conflicts += 1; continue; }
        if (seen.has(key)) { duplicates += 1; continue; }
        seen.add(key); additions.push(item);
      }
      return { additions, conflicts, duplicates };
    }
  };
  return new Function('db', 'VolturaFinance', `${helperSource}; return additiveRestore;`)(db, finance);
}

test('additive restore keeps existing IDs, deduplicates backup rows and normalizes account case', async () => {
  const db = makeDatabase({
    transactions: [{ id: 'keep', amountPaise: 100, account: 'Everyday' }],
    budgets: [{ id: 'food-old', category: 'Food', limitPaise: 5000 }],
    goals: [{ id: 'goal-keep', name: 'Keep me' }],
    accounts: [{ name: 'Everyday', kind: 'asset', openingBalancePaise: 1000 }]
  });
  const restore = getRestore(db);
  const counts = await restore(['transactions', 'budgets', 'goals', 'accounts'], {
    transactions: [
      { id: 'keep', amountPaise: 999, account: 'everyday' },
      { id: 'new-1', amountPaise: 200, account: 'everyday' },
      { id: 'new-1', amountPaise: 300, account: 'Everyday' },
      { id: 'new-2', amountPaise: 400, account: 'Pocket' }
    ],
    budgets: [
      { id: 'food-new', category: 'food', limitPaise: 9000 },
      { id: 'travel', category: 'Transport', limitPaise: 2000 }
    ],
    goals: [{ id: 'goal-keep', name: 'Overwrite attempt' }, { id: 'goal-new', name: 'New goal' }],
    accounts: [
      { name: 'everyday', kind: 'liability', openingBalancePaise: 99999 },
      { name: 'Pocket', kind: 'asset', openingBalancePaise: 0 }
    ]
  });
  assert.equal(db.records.transactions.get('keep').amountPaise, 100);
  assert.equal(db.records.transactions.get('new-1').amountPaise, 200);
  assert.equal(db.records.transactions.get('new-1').account, 'Everyday');
  assert.equal(db.records.transactions.get('new-2').account, 'Pocket');
  assert.equal(db.records.accounts.get('Everyday').kind, 'asset');
  assert.equal(db.records.budgets.has('food-new'), false);
  assert.equal(db.records.budgets.has('travel'), true);
  assert.equal(db.records.goals.get('goal-keep').name, 'Keep me');
  assert.equal(db.records.goals.has('goal-new'), true);
  assert.deepEqual(counts, {
    transactions: 2, transactionConflicts: 1, transactionDuplicates: 1,
    budgets: 1, budgetConflicts: 1, goals: 1, goalConflicts: 1,
    goalDuplicates: 0, accounts: 1, accountConflicts: 1
  });
});
