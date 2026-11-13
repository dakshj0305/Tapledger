const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const read = name => fs.readFileSync(name, 'utf8');

test('GSAP core and plugins are loaded locally in dependency order', () => {
 const html=read('index.html');
 const paths=['vendor/gsap/gsap.min.js','vendor/gsap/ScrollTrigger.min.js','vendor/gsap/DrawSVGPlugin.min.js','vendor/gsap/MotionPathPlugin.min.js','vendor/gsap/Flip.min.js','finance-core.js','app.js','gsap-motion.js'];
 const positions=paths.map(path=>html.indexOf('./'+path));
 assert.ok(positions.every(x=>x>=0),'missing script path: '+JSON.stringify(paths.map((p,i)=>[p,positions[i]])));
 assert.deepEqual(positions,[...positions].sort((a,b)=>a-b),'scripts must load in dependency order');
});

test('all bundled GSAP assets report the same version',()=>{
 for(const file of ['gsap.min.js','ScrollTrigger.min.js','DrawSVGPlugin.min.js','MotionPathPlugin.min.js','Flip.min.js'])assert.match(read('vendor/gsap/'+file).slice(0,300),/3\.15\.1/,file+' version');
});

test('service worker precaches all new local GSAP assets and has a new cache namespace',()=>{
 const sw=read('sw.js');assert.match(sw,/voltura-platform-v26\.2-dashboard-redesign/);
 for(const file of ['gsap-motion.js','vendor/gsap/DrawSVGPlugin.min.js','vendor/gsap/MotionPathPlugin.min.js','vendor/gsap/Flip.min.js']){assert.ok(sw.includes("'"+file+"'"),'precache contains '+file);assert.ok(fs.existsSync(file),'precache target exists: '+file);}
});

test('finance animation is progressive, reduced-motion aware and uses stable chart identities',()=>{
 const motion=read('gsap-motion.js'),app=read('app.js'),html=read('index.html');
 assert.match(motion,/prefers-reduced-motion: reduce/);assert.match(motion,/MotionPathPlugin/);assert.match(motion,/DrawSVGPlugin/);assert.match(motion,/Flip/);
 assert.match(app,/data-flip-id="cashflow-\$\{k\}"/);assert.match(html,/id="balanceFlowPath"/);assert.match(html,/aria-hidden="true"[^>]*focusable="false"/);
});

test('runtime CSS is reproducible from its maintained source layers',()=>{
 const {build}=require('./build-css.cjs');assert.equal(build(),read('voltura.css'));
});


test('V26.2 dashboard refresh is linked, cached and has visible motion hooks',()=>{
 const html=read('index.html'),sw=read('sw.js'),css=read('dashboard-refresh.css'),motion=read('gsap-motion.js');
 assert.match(html,/VOLTURA-26\.2-DASHBOARD-REDESIGN/);assert.match(html,/\.\/dashboard-refresh\.css/);
 assert.match(sw,/voltura-platform-v26\.2-dashboard-redesign/);assert.match(sw,/'dashboard-refresh\.css'/);
 assert.match(css,/\.balance-hero/);assert.match(css,/\.cashflow-panel/);assert.match(css,/@media\s*\(max-width:\s*800px\)/);
 assert.match(motion,/elastic\.out/);assert.match(motion,/power3\.out/);assert.match(motion,/prefers-reduced-motion: reduce/);
});
