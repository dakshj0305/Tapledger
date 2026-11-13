/* Pure local finance helpers. No storage, network, or browser side effects. */
(() => {
  'use strict';
  const expenseCategories = ['Food','Transport','Shopping','Bills','Health','Education','Entertainment','Home','Personal care','Other'];
  const patterns = [
    ['Food', /swiggy|zomato|blinkit|zepto|restaurant|cafe|coffee|lunch|dinner|breakfast|food|pizza|burger|grocery|grocer|dominos|mcdonald/],
    ['Transport', /uber|ola|rapido|metro|bus|train|fuel|petrol|cab|auto|parking|irctc/],
    ['Shopping', /amazon|flipkart|shopping|mall|clothes|shoes|myntra|ajio/],
    ['Bills', /electric|electricity|water bill|internet|wifi|recharge|mobile bill|rent/],
    ['Health', /doctor|medicine|pharmacy|hospital|clinic|health/],
    ['Education', /course|book|class|tuition|education/],
    ['Entertainment', /movie|netflix|spotify|game|concert/],
    ['Home', /furniture|hardware|cleaning|home supply/],
    ['Personal care', /salon|barber|skincare|personal care/]
  ];
  function merchantKey(value) { return String(value || '').normalize('NFKC').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim(); }
  function inferMerchantCategory(value) {
    const text = merchantKey(value);
    if (!text) return '';
    for (const [category, pattern] of patterns) if (pattern.test(text)) return category;
    return '';
  }
  function suggestMerchantCategory(merchant, transactions, type = 'expense') {
    const key = merchantKey(merchant);
    if (!key) return '';
    const history = (transactions || []).filter(item => item.type === type && merchantKey(item.merchant) === key && (type !== 'expense' || expenseCategories.includes(item.category)));
    if (history.length) {
      const counts = new Map();
      for (const item of history) {
        const row = counts.get(item.category) || { count: 0, latest: '' };
        row.count += 1;
        const date = `${item.date || ''}T${item.time || ''}`;
        if (date > row.latest) row.latest = date;
        counts.set(item.category, row);
      }
      return [...counts.entries()].sort((a, b) => b[1].count - a[1].count || b[1].latest.localeCompare(a[1].latest) || a[0].localeCompare(b[0]))[0][0];
    }
    return type === 'expense' ? inferMerchantCategory(merchant) : '';
  }
  function compareTransactions(a, b) {
    return String(a.date || '').localeCompare(String(b.date || '')) || String(a.time || '').localeCompare(String(b.time || '')) || String(a.createdAt || '').localeCompare(String(b.createdAt || '')) || String(a.id || '').localeCompare(String(b.id || ''));
  }
  function validCalendarDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T12:00:00`);
    return Number.isFinite(date.getTime()) &&
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` === value;
  }
  function calendarDate(value) {
    if (!validCalendarDate(value)) return null;
    const [year, month, day] = value.split('-').map(Number);
    const targetYear = year - 1;
    const targetDay = Math.min(day, new Date(targetYear, month, 0).getDate());
    return `${targetYear}-${String(month).padStart(2, '0')}-${String(targetDay).padStart(2, '0')}`;
  }
  function detectUnusualExpenses(transactions) {
    const byCategory = new Map();
    for (const item of transactions || []) {
      if (item.type !== 'expense' || !Number.isSafeInteger(item.amountPaise) || item.amountPaise <= 0 || !validCalendarDate(item.date)) continue;
      const list = byCategory.get(item.category) || [];
      list.push(item);
      byCategory.set(item.category, list);
    }
    const results = [];
    for (const [category, items] of byCategory) {
      items.sort(compareTransactions);
      let start = 0;
      let priorTotal = 0n;
      const prior = [];
      for (const item of items) {
        const cutoff = calendarDate(item.date);
        while (start < prior.length && prior[start].date < cutoff) {
          priorTotal -= BigInt(prior[start].amountPaise);
          start += 1;
        }
        const earlierCount = prior.length - start;
        if (earlierCount >= 5) {
          const amount = BigInt(item.amountPaise);
          if (amount * 2n * BigInt(earlierCount) > priorTotal * 3n) {
            const averagePaise = Number(priorTotal / BigInt(earlierCount));
            results.push({ transaction: item, category, averagePaise, priorCount: earlierCount });
          }
        }
        prior.push(item);
        priorTotal += BigInt(item.amountPaise);
      }
    }
    return results.sort((a, b) => compareTransactions(b.transaction, a.transaction));
  }
  // Add-only restore planner. Existing primary keys always win; duplicate keys
  // inside one backup are also accepted only once. No input records are mutated.
  function planAdditiveRecords(existing, incoming, keyOf) {
    const occupied = new Set((existing || []).map(item => String(keyOf(item))));
    const seen = new Set();
    const additions = [];
    let conflicts = 0;
    let duplicates = 0;
    for (const item of incoming || []) {
      const key = String(keyOf(item));
      if (occupied.has(key)) { conflicts += 1; continue; }
      if (seen.has(key)) { duplicates += 1; continue; }
      seen.add(key);
      additions.push(item);
    }
    return { additions, conflicts, duplicates };
  }
  function budgetStatus(usedPaise, limitPaise) {
    if (!Number.isSafeInteger(usedPaise) || usedPaise < 0 ||
        !Number.isSafeInteger(limitPaise) || limitPaise <= 0) return 'unset';
    const used = BigInt(usedPaise);
    const limit = BigInt(limitPaise);
    if (used >= limit) return 'exceeded';
    if (used * 100n >= limit * 80n) return 'warning';
    return 'within';
  }
  function weeklyExpenseSummary(transactions, monthKey) {
    if (typeof monthKey !== 'string' || !/^(\d{4})-(0[1-9]|1[0-2])$/.test(monthKey)) return [];
    const [year, month] = monthKey.split('-').map(Number);
    const first = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0).getDate();
    let start = 1;
    let end = Math.min(lastDay, 7 - ((first.getDay() + 6) % 7));
    const weeks = [];
    while (start <= lastDay) {
      const total = (transactions || []).reduce((sum, item) => {
        if (item?.type !== 'expense' || item.date?.slice(0, 7) !== monthKey ||
            !validCalendarDate(item.date) || !Number.isSafeInteger(item.amountPaise) || item.amountPaise < 0) return sum;
        const day = Number(item.date.slice(8, 10));
        if (day < start || day > end) return sum;
        const next = sum + item.amountPaise;
        if (!Number.isSafeInteger(next)) throw new RangeError(`Weekly expense total exceeds the safe integer range for ${monthKey}.`);
        return next;
      }, 0);
      const totalPaise = total;
      weeks.push({ startDay: start, endDay: end, totalPaise });
      start = end + 1;
      end = Math.min(lastDay, start + 6);
    }
    return weeks;
  }
  (typeof window !== 'undefined' ? window : globalThis).VolturaFinance = Object.freeze({ merchantKey, inferMerchantCategory, suggestMerchantCategory, detectUnusualExpenses, budgetStatus, weeklyExpenseSummary, planAdditiveRecords });
})();
