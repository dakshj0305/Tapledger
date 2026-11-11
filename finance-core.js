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
  function calendarDate(value) {
    const date = new Date(`${value}T12:00:00`);
    if (!Number.isFinite(date.getTime())) return null;
    date.setMonth(date.getMonth() - 12);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  function detectUnusualExpenses(transactions) {
    const byCategory = new Map();
    for (const item of transactions || []) {
      if (item.type !== 'expense' || !Number.isSafeInteger(item.amountPaise) || item.amountPaise <= 0 || !/^\d{4}-\d{2}-\d{2}$/.test(item.date || '')) continue;
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
  function budgetStatus(usedPaise, limitPaise) {
    if (!Number.isSafeInteger(limitPaise) || limitPaise <= 0) return 'unset';
    if (usedPaise >= limitPaise) return 'exceeded';
    if (usedPaise * 100 >= limitPaise * 80) return 'warning';
    return 'within';
  }
  function weeklyExpenseSummary(transactions, monthKey) {
    const [year, month] = monthKey.split('-').map(Number);
    const first = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0).getDate();
    let start = 1;
    let end = Math.min(lastDay, 7 - ((first.getDay() + 6) % 7));
    const weeks = [];
    while (start <= lastDay) {
      const totalPaise = (transactions || []).reduce((sum, item) => {
        const day = Number(String(item.date || '').slice(8, 10));
        return sum + (item.type === 'expense' && item.date?.slice(0, 7) === monthKey && day >= start && day <= end ? item.amountPaise : 0);
      }, 0);
      weeks.push({ startDay: start, endDay: end, totalPaise });
      start = end + 1;
      end = Math.min(lastDay, start + 6);
    }
    return weeks;
  }
  (typeof window !== 'undefined' ? window : globalThis).VolturaFinance = Object.freeze({ merchantKey, inferMerchantCategory, suggestMerchantCategory, detectUnusualExpenses, budgetStatus, weeklyExpenseSummary });
})();
