const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;

let server, browser;
const origin = 'http://127.0.0.1:4173';

test.before(async () => {
  server = spawn('python3', ['-m', 'http.server', '4173', '--bind', '127.0.0.1'], { stdio: 'ignore' });
  await new Promise((resolve, reject) => {
    const started = Date.now();
    const poll = async () => {
      try {
        const response = await fetch(origin);
        if (response.ok) return resolve();
      } catch {}
      if (Date.now() - started > 15000) return reject(new Error('Local test server did not start'));
      setTimeout(poll, 250);
    };
    poll();
  });
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
});

test.after(async () => {
  if (browser) await browser.close();
  if (server) server.kill();
});

test('desktop dashboard boots with local GSAP plugins and no uncaught page errors', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.documentElement.dataset.gsap === 'ready', { timeout: 15000 });
  assert.ok(await page.locator('#view-overview.active').count());
  assert.ok(await page.locator('#balanceFlowPath').count());
  assert.ok(await page.locator('#cashflowChart').count());
  const plugins = await page.locator('html').getAttribute('data-gsap-plugins');
  for (const name of ['ScrollTrigger','MotionPath','DrawSVG','Flip']) assert.ok(plugins.includes(name), 'missing ' + name);
  assert.deepEqual(errors, []);
  await context.close();
});

test('desktop accessibility scan has no critical or serious WCAG violations', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.waitForSelector('#view-overview.active');
  const results = await new AxeBuilder({ page }).include(['.balance-hero','#cashflowChart','#overviewDonut','#budgetProgressBar']).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  const highImpact = results.violations.filter(item => item.impact === 'critical' || item.impact === 'serious');
  assert.deepEqual(highImpact.map(item => ({ id: item.id, impact: item.impact, nodes: item.nodes.map(node => ({ target: node.target, html: node.html, summary: node.failureSummary })) })), [], 'axe accessibility findings');
  await context.close();
});

test('mobile viewport remains usable and reduced-motion preference is respected', async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.documentElement.dataset.gsap === 'ready', { timeout: 15000 });
  assert.equal(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), true);
  assert.ok(await page.locator('#mobileAddButton').isVisible());
  const widths = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  assert.ok(widths.content <= widths.viewport + 2, 'mobile page has horizontal overflow: ' + JSON.stringify(widths));
  await page.locator('#mobileAddButton').click();
  await page.locator('#entryDialog[open]').waitFor();
  assert.ok(await page.locator('#entryAmount').isVisible());
  assert.deepEqual(errors, []);
  await context.close();
});

test('a transaction can be entered into the isolated browser profile', async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.waitForSelector('#topAddButton');
  await page.locator('#topAddButton').click();
  await page.locator('#entryDialog[open]').waitFor();
  await page.locator('#entryAmount').fill('12.34');
  await page.locator('#entryDate').fill(new Date().toISOString().slice(0,10));
  await page.locator('#entryMerchant').fill('VOLTURA automated QA');
  await page.locator('#entryForm button[type="submit"]').click();
  await page.waitForFunction(() => document.querySelector('#recentTransactions')?.textContent.includes('VOLTURA automated QA'), { timeout: 10000 });
  const count = await page.evaluate(() => new Promise((resolve, reject) => {
    const request = indexedDB.open('tapledger-db');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('transactions', 'readonly');
      const countRequest = tx.objectStore('transactions').count();
      countRequest.onsuccess = () => { resolve(countRequest.result); db.close(); };
      countRequest.onerror = () => reject(countRequest.error);
    };
  }));
  assert.ok(count >= 1, 'transaction persisted to IndexedDB');
  await context.close();
});
