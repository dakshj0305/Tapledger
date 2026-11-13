const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {build,layers}=require('./build-css.cjs');

test('runtime CSS is reproducible from maintained local design layers',()=>{
 assert.equal(layers.length,9);
 assert.equal(build(),fs.readFileSync('voltura.css','utf8'));
});

test('runtime CSS contains no gradient, blur or decorative shadow residue',()=>{
 const css=fs.readFileSync('voltura.css','utf8');
 assert.doesNotMatch(css,/(?:linear|radial|conic)-gradient\(/i);
 assert.doesNotMatch(css,/backdrop-filter\s*:\s*blur\(/i);
 assert.doesNotMatch(css,/filter\s*:\s*blur\(/i);
 assert.match(css,/box-shadow:2px 2px 0 var\(--v26-pine\)!important/);
});
