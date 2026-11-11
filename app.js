'use strict';
const $=s=>document.querySelector(s);
const CATS={expense:['Food','Transport','Bills','Shopping','Health','Other'],income:['Salary','Refund','Other']};
const MAX=10000000000; // ₹10 crore in paise
const inr=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'});
const fmt=p=>inr.format(p/100);
let db,mode='expense',saving=false,last=null,timer=0,all=[];
const buzz=p=>{try{if(vibOn()&&navigator.vibrate)navigator.vibrate(p)}catch{}};
const openDb=()=>new Promise((res,rej)=>{const r=indexedDB.open('voltura-preview-db',1);r.onupgradeneeded=()=>r.result.createObjectStore('tx',{keyPath:'id'});r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
const run=(m,f)=>new Promise((res,rej)=>{const t=db.transaction('tx',m);const q=f(t.objectStore('tx'));t.oncomplete=()=>res(q&&q.result);t.onerror=t.onabort=()=>rej(t.error)});
const loadAll=async()=>{all=(await run('readonly',s=>s.getAll()))||[]};
function parse(v){const m=/^(\d{1,9})(?:\.(\d{1,2}))?$/.exec(v.trim().replace(/,/g,''));if(!m)return null;const p=Number(m[1])*100+(m[2]?Number(m[2].padEnd(2,'0')):0);return p>0&&p<=MAX?p:null}
function chips(){const c={};all.filter(t=>t.type===mode).forEach(t=>{c[t.cat]=(c[t.cat]||0)+1});
 const list=[...CATS[mode]].sort((a,b)=>(c[b]||0)-(c[a]||0));const box=$('#chips');box.replaceChildren();
 list.forEach((n,i)=>{const l=document.createElement('label');l.className='chip';const r=document.createElement('input');r.type='radio';r.name='cat';r.value=n;r.checked=i===0;const s=document.createElement('span');s.textContent=n;l.append(r,s);box.append(l)})}
function setMode(m){mode=m;const e=m==='expense';$('#sheetTitle').textContent=e?'Add expense':'Add income';$('#save').textContent=e?'Save expense':'Save income';document.querySelector(`input[name=type][value=${m}]`).checked=true;chips()}
function openSheet(m){clearTimeout(timer);$('#form').reset();$('#err').textContent='';$('#amt').removeAttribute('aria-invalid');setMode(m);$('#form').hidden=false;$('#done').hidden=true;const d=$('#sheet');if(!d.open)d.showModal();$('#amt').focus()}
function render(){queueMicrotask(()=>{extras();more()});const n=new Date(),m0=new Date(n.getFullYear(),n.getMonth(),1).getTime();let e=0,i=0;
 all.forEach(t=>{if(t.ts>=m0){if(t.type==='expense')e+=t.paise;else i+=t.paise}});
 $('#spent').textContent=fmt(e);$('#earned').textContent=fmt(i);$('#net').textContent=(i-e<0?'−':'+')+fmt(Math.abs(i-e));
 const ul=$('#list');ul.replaceChildren();const rows=[...all].sort((a,b)=>b.ts-a.ts).slice(0,25);$('#empty').hidden=rows.length>0;
 rows.forEach(t=>{const li=document.createElement('li');const d=document.createElement('div');const a=document.createElement('strong');a.textContent=t.cat;
  const b=document.createElement('small');b.textContent=new Date(t.ts).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})+(t.note?' – '+t.note:'');d.append(a,b);
  const amt=document.createElement('span');amt.className='amt '+t.type;amt.textContent=(t.type==='expense'?'− ':'+ ')+fmt(t.paise);
  const x=document.createElement('button');x.type='button';x.className='btn';x.textContent='Delete';x.setAttribute('aria-label',`Delete ${t.type} of ${fmt(t.paise)}, ${t.cat}`);
  x.onclick=async()=>{if(confirm(`Delete this ${t.type} of ${fmt(t.paise)} (${t.cat})? This cannot be undone.`)){await run('readwrite',s=>s.delete(t.id));await loadAll();render()}};
  li.append(d,amt,x);ul.append(li)})}
function showDone(rec,flag=''){$('#form').hidden=true;$('#done').hidden=false;$('#doneMsg').textContent='Saved '+fmt(rec.paise);$('#doneSub').textContent=`${rec.type==='expense'?'Expense':'Income'} in ${rec.cat}. You can undo for 5 seconds.${flag}`;$('#undo').hidden=false;$('#doneMsg').focus();
 clearTimeout(timer);timer=setTimeout(()=>{$('#undo').hidden=true;$('#doneSub').textContent='Saved.'},5000)}
$('#form').addEventListener('submit',async e=>{e.preventDefault();if(saving)return;
 const amt=$('#amt'),err=$('#err'),p=parse(amt.value);
 if(!p){err.textContent='Enter an amount above ₹0 and up to ₹10,00,00,000, with at most 2 decimals.';amt.setAttribute('aria-invalid','true');buzz([40,60,40]);amt.focus();return}
 amt.removeAttribute('aria-invalid');err.textContent='';saving=true;$('#save').disabled=true;
 const rec={id:crypto.randomUUID(),type:mode,paise:p,cat:new FormData(e.target).get('cat')||'Other',note:$('#note').value.trim().slice(0,80),ts:Date.now()};
 const flag=unusual(rec);try{await run('readwrite',s=>s.put(rec));last=rec.id;buzz([15,40,25]);await loadAll();render();history.replaceState(null,'',location.pathname);showDone(rec,flag+budgetNote(rec))}
 catch{err.textContent='Could not save. Nothing was recorded.';buzz([40,60,40])}
 finally{saving=false;$('#save').disabled=false}});
document.querySelectorAll('input[name=type]').forEach(r=>r.addEventListener('change',()=>setMode(r.value)));
$('#undo').onclick=async()=>{if(!last)return;try{await run('readwrite',s=>s.delete(last));last=null;await loadAll();render();clearTimeout(timer);$('#undo').hidden=true;$('#doneMsg').textContent='Undone';$('#doneSub').textContent='That entry was removed.'}catch{$('#doneSub').textContent='Could not undo. Delete it from the list.'}};
$('#again').onclick=()=>openSheet(mode);
$('#view').onclick=()=>$('#sheet').close();
$('#cancel').onclick=()=>$('#sheet').close();
$('#sheet').addEventListener('close',()=>{clearTimeout(timer);history.replaceState(null,'',location.pathname)});
$('#addE').onclick=()=>openSheet('expense');$('#addI').onclick=()=>openSheet('income');
$('#export').onclick=()=>{const b=new Blob([JSON.stringify({app:'VolturaPreview',exported:new Date().toISOString(),transactions:all},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='voltura-preview-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
(async()=>{try{db=await openDb();await loadAll();render()}catch{$('#fatal').hidden=false;return}
 const q=new URLSearchParams(location.search);if(q.has('a'))openSheet('expense');else if(q.has('i'))openSheet('income');
 if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{})})();

// Unusual-spend flag: expense > 150% of the mean of prior same-category expenses in the last 12 months
// (needs >= 5 prior). paise > 1.5*sum/n  <=>  paise*2*n > 3*sum (integer paise only).
function unusual(rec){if(rec.type!=='expense')return'';const cut=rec.ts-365*864e5;
 const prior=all.filter(t=>t.type==='expense'&&t.cat===rec.cat&&t.ts>=cut);if(prior.length<5)return'';
 const sum=prior.reduce((s,t)=>s+t.paise,0);return rec.paise*2*prior.length>3*sum?` Higher than your usual for ${rec.cat}.`:''}
// Weekly bars (week = 7-day block of this month) with a table alternative, plus a 7-day vs prior-7-day line.
function extras(){const now=new Date(),y=now.getFullYear(),mo=now.getMonth(),ms=new Date(y,mo,1).getTime();
 const wk=[0,0,0,0,0];all.forEach(t=>{if(t.type==='expense'&&t.ts>=ms){const d=new Date(t.ts);if(d.getFullYear()===y&&d.getMonth()===mo)wk[Math.min(4,Math.floor((d.getDate()-1)/7))]+=t.paise}});
 const mx=Math.max(...wk,1),box=$('#bars'),tb=$('#wtab'),cw=Math.min(4,Math.floor((now.getDate()-1)/7));box.replaceChildren();tb.replaceChildren();
 wk.forEach((v,i)=>{const b=document.createElement('div');b.className='bar'+(i===cw?' now':'');const f=document.createElement('i');f.style.height=Math.round(v/mx*100)+'%';
  const l=document.createElement('span');l.textContent='Wk '+(i+1);b.append(f,l);box.append(b);
  const r=tb.insertRow();r.insertCell().textContent='Week '+(i+1)+', days '+(i*7+1)+' to '+(i===4?'month end':i*7+7);r.insertCell().textContent=fmt(v)});
 const D=864e5,n=Date.now();let a=0,p=0;all.forEach(t=>{if(t.type!=='expense')return;const g=n-t.ts;if(g>=0&&g<7*D)a+=t.paise;else if(g>=7*D&&g<14*D)p+=t.paise});
 $('#insight').textContent=p?`Last 7 days: ${fmt(a)} spent, ${a<=p?Math.round((p-a)*100/p)+'% lower':Math.round((a-p)*100/p)+'% higher'} than the 7 days before.`:(a?`Last 7 days: ${fmt(a)} spent. Not enough earlier data to compare.`:'No spending in the last 7 days.')}

// ---- views, budget, ledger, settings, backup/restore, CSV ----
const LS={get:k=>{try{return localStorage.getItem(k)}catch{return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch{}}};
const vibOn=()=>{const v=LS.get('vv');return v===null?!matchMedia('(prefers-reduced-motion: reduce)').matches:v==='1'};
const budget=()=>Number(LS.get('vb'))||0;
const monthStart=()=>{const n=new Date();return new Date(n.getFullYear(),n.getMonth(),1).getTime()};
const monthSpent=()=>{const m=monthStart();return all.reduce((s,t)=>s+(t.type==='expense'&&t.ts>=m?t.paise:0),0)};
function budgetNote(rec){const b=budget();if(rec.type!=='expense'||!b)return'';const p=Math.floor(monthSpent()*100/b);return p>=100?` Monthly budget is over (${p}%).`:p>=80?` Monthly budget is at ${p}%.`:''}
function row(t){const li=document.createElement('li'),d=document.createElement('div'),a=document.createElement('strong'),b=document.createElement('small');a.textContent=t.cat;
 b.textContent=new Date(t.ts).toLocaleString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})+(t.note?' – '+t.note:'');d.append(a,b);
 const amt=document.createElement('span');amt.className='amt '+t.type;amt.textContent=(t.type==='expense'?'− ':'+ ')+fmt(t.paise);
 const x=document.createElement('button');x.type='button';x.className='btn';x.textContent='Delete';x.setAttribute('aria-label',`Delete ${t.type} of ${fmt(t.paise)}, ${t.cat}`);
 x.onclick=async()=>{if(confirm(`Delete this ${t.type} of ${fmt(t.paise)} (${t.cat})? This cannot be undone.`)){await run('readwrite',s=>s.delete(t.id));await loadAll();render()}};
 li.append(d,amt,x);return li}
function ledger(){const q=$('#q').value.trim().toLowerCase(),f=$('#tf').value,ul=$('#llist');ul.replaceChildren();
 const rows=[...all].sort((a,b)=>b.ts-a.ts).filter(t=>(f==='all'||t.type===f)&&(!q||(t.cat+' '+(t.note||'')).toLowerCase().includes(q)));
 $('#lcount').textContent=`${rows.length} of ${all.length} entries`+(rows.length>200?' (showing 200)':'');rows.slice(0,200).forEach(t=>ul.append(row(t)))}
function more(){const b=budget(),sp=monthSpent(),p=b?Math.floor(sp*100/b):0;
 $('#bnum').textContent=b?`${fmt(sp)} of ${fmt(b)} used (${p}%)`:'No monthly budget set. Add one in More.';
 $('#bstat').textContent=!b?'':p>=100?'Status: over budget':p>=80?'Status: 80% or more used':'Status: on track';
 $('#meter').style.width=Math.min(100,p)+'%';
 $('#alert').hidden=!(b&&p>=80);$('#alert').textContent=p>=100?`Heads up: this month’s spending is over your ${fmt(b)} budget.`:`Heads up: ${p}% of your monthly budget is used.`;
 const lb=Number(LS.get('lb')),txt=lb?new Date(lb).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}):'never';
 $('#remind').hidden=!(all.length&&(!lb||Date.now()-lb>30*864e5));$('#lbtxt').textContent=txt;$('#lbtxt2').textContent=txt;
 if(document.activeElement!==$('#bin'))$('#bin').value=b?Math.floor(b/100)+(b%100?'.'+String(b%100).padStart(2,'0'):''):'';
 ledger()}
function view(){let h=(location.hash||'#home').slice(1);const V=['home','ledger','more'];if(!V.includes(h))h='home';
 V.forEach(v=>{$('#v-'+v).hidden=v!==h;const a=$('#n-'+v);if(v===h)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});document.title='VOLTURA – '+h[0].toUpperCase()+h.slice(1)}
addEventListener('hashchange',view);view();
$('#navAdd').onclick=()=>openSheet('expense');
$('#view').addEventListener('click',()=>{location.hash='#home'});
$('#q').oninput=ledger;$('#tf').onchange=ledger;
$('#bsave').onclick=()=>{const v=$('#bin').value.trim(),m=$('#bmsg');if(v===''){LS.set('vb','0');m.textContent='Budget removed.';more();return}
 const p=parse(v);if(!p){m.textContent='Enter an amount above ₹0 with at most 2 decimals.';return}LS.set('vb',String(p));m.textContent='Budget saved.';more()};
$('#vib').checked=vibOn();$('#vib').onchange=e=>LS.set('vv',e.target.checked?'1':'0');
$('#export').addEventListener('click',()=>{LS.set('lb',String(Date.now()));more()});
$('#csv').onclick=()=>{const c=v=>{let s=String(v);if(/^[=+\-@\t\r]/.test(s))s="'"+s;return'"'+s.replace(/"/g,'""')+'"'};
 const L=['Date,Type,Category,Note,Amount INR',...[...all].sort((a,b)=>a.ts-b.ts).map(t=>[new Date(t.ts).toISOString(),t.type,t.cat,t.note||'',Math.floor(t.paise/100)+'.'+String(t.paise%100).padStart(2,'0')].map(c).join(','))];
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([L.join('\r\n')],{type:'text/csv'}));a.download='voltura-preview.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
$('#rbtn').onclick=()=>$('#restore').click();
$('#restore').onchange=async e=>{const f=e.target.files[0],m=$('#rmsg');e.target.value='';if(!f)return;
 try{if(f.size>5e6)throw 0;const j=JSON.parse(await f.text()),a=j&&j.app==='VolturaPreview'&&Array.isArray(j.transactions)?j.transactions:null;if(!a||a.length>50000)throw 0;
  const ok=t=>t&&typeof t.id==='string'&&t.id.length<=64&&(t.type==='expense'||t.type==='income')&&Number.isInteger(t.paise)&&t.paise>0&&t.paise<=MAX&&typeof t.cat==='string'&&t.cat.length<=30&&(t.note===undefined||(typeof t.note==='string'&&t.note.length<=80))&&Number.isFinite(t.ts);
  if(!a.every(ok))throw 0;const clean=a.map(t=>({id:t.id,type:t.type,paise:t.paise,cat:t.cat,note:t.note||'',ts:t.ts}));
  await run('readwrite',s=>{clean.forEach(t=>s.put(t))});await loadAll();render();m.textContent=`Restored ${clean.length} entries (merged by ID).`}
 catch{m.textContent='Could not restore. Use a backup downloaded from this app. Nothing was changed.'}};
$('#wipe').onclick=async()=>{if(prompt('Type DELETE to permanently remove all entries on this device. Download a backup first.')!=='DELETE')return;await run('readwrite',s=>s.clear());await loadAll();render()};
