const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = __dirname;
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');

function listFiles(directory, relative = '.') {
  const result = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const absolute = path.join(directory, entry.name);
    const rel = path.posix.join(relative === '.' ? '' : relative, entry.name);
    if (entry.isDirectory()) result.push(...listFiles(absolute, rel));
    else if (entry.isFile()) result.push(rel);
  }
  return result;
}

test('release labels and source build identifiers consistently identify V25.2', () => {
  assert.match(read('README.md'), /Current source release: V25\.2/);
  assert.match(read('RELEASE.md'), /current V25\.2/);
  assert.match(read('RELEASE-REPORT-V25.2.md'), /VOLTURA V25\.2/);
  assert.match(read('index.html'), /data-build-id="VOLTURA-25\.2-ATELIER-20261113"/);
  assert.match(read('app.js'), /VOLTURA v25\.2/);
  assert.match(read('sw.js'), /voltura-platform-v25\.2/);
  assert.match(read('CHANGELOG-V25.2.md'), /V25\.2/);
});

test('SHA-256 manifest covers every shipped file and matches current bytes', () => {
  const manifest = read('SHA256SUMS.txt');
  const entries = new Map();
  for (const line of manifest.split(/\r?\n/).filter(Boolean)) {
    const match = line.match(/^([a-f0-9]{64})  (.+)$/);
    assert.ok(match, `Invalid checksum line: ${line}`);
    const relative = match[2].replace(/^\.\//, '');
    assert.ok(!entries.has(relative), `Duplicate checksum entry: ${relative}`);
    entries.set(relative, match[1]);
    const absolute = path.join(root, relative);
    assert.ok(fs.existsSync(absolute) && fs.statSync(absolute).isFile(), `Missing checksum target: ${relative}`);
    const actual = crypto.createHash('sha256').update(fs.readFileSync(absolute)).digest('hex');
    assert.equal(actual, match[1], `Checksum mismatch: ${relative}`);
  }
  const actualFiles = listFiles(root).filter((file) => file !== 'SHA256SUMS.txt').sort();
  assert.deepEqual([...entries.keys()].sort(), actualFiles, 'Manifest must cover all shipped files except itself');
});
