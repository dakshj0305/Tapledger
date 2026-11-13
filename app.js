'use strict';

/* VOLTURA v26.2 — static, local-first personal finance PWA.
   Internal DB/store names intentionally retain their TapLedger identity for existing data compatibility.
   Currency amounts are stored as integer paise to avoid floating point drift. */
const DB_NAME='tapledger-db', DB_VERSION=3, CURRENCY='INR';
const EXPENSE_CATEGORIES=['Food','Transport','Shopping','Bills','Health','Education','Entertainment','Home','Personal care','Other'];
const INCOME_CATEGORIES=['Salary','Freelance','Business','Gift','Interest','Refund','Other'];
const META={
  Food:{icon:'◒',color:'#526d85'},Transport:{icon:'↗',color:'#304f70'},Shopping:{icon:'◇',color:'#b49b70'},Bills:{icon:'▤',color:'#8ea18a'},
  Health:{icon:'✳',color:'#b87980'},Education:{icon:'⌑',color:'#7774a8'},Entertainment:{icon:'✦',color:'#bd8655'},Home:{icon:'⌂',color:'#74917c'},
  'Personal care':{icon:'✧',color:'#9a82a7'},Other:{icon:'＋',color:'#8b8c82'},Salary:{icon:'↗',color:'#628769'},Freelance:{icon:'⌁',color:'#607d91'},
  Business:{icon:'▥',color:'#8ea18a'},Gift:{icon:'✳',color:'#c5a467'},Interest:{icon:'％',color:'#74917c'},Refund:{icon:'↶',color:'#b87980'},Transfer:{icon:'⇄',color:'#9b998c'}
};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let db,transactions=[],budgets=[],goals=[],accounts=[],selectedView='overview',toastTimer,sourceForNext='manual',quickExpenseCategory='Food',quickCategoryTouched=false,quickExpenseSaving=false,quickUndoTimer=0,lastQuickSavedId='',hapticEnabled=false;
const nowDate=()=>new Date();
let entrySaving=false;
let serviceWorkerRegistration=null,waitingServiceWorker=null,updateActivationRequested=false,serviceWorkerHadController=false;
/* Shared row glyph for the overview and ledger; META supplies every category. */
function transactionIcon(t){return (META[t&&t.category]||META.Other).icon}
const dateKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const today=()=>dateKey(nowDate());
const monthKey=s=>String(s||'').slice(0,7);
const monthDate=key=>new Date(`${key}-01T12:00:00`);
const thisMonth=()=>monthKey(today());
const shiftMonth=(key,n)=>{const d=monthDate(key);d.setMonth(d.getMonth()+n);return monthKey(dateKey(d))};
/* Amounts with a fractional part render with exactly two decimals (₹125.50);
   whole rupees stay compact (₹1,234). Paise arithmetic is unaffected. */
const money=p=>new Intl.NumberFormat('en-IN',{style:'currency',currency:CURRENCY,minimumFractionDigits:2,maximumFractionDigits:2}).format((Number(p)||0)/100).replace(/\.00$/,'');
const moneyExact=p=>new Intl.NumberFormat('en-IN',{style:'currency',currency:CURRENCY,minimumFractionDigits:2,maximumFractionDigits:2}).format((Number(p)||0)/100);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtDate=s=>new Date(`${s}T12:00:00`).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
const sum=(arr,selector=x=>x.amountPaise)=>arr.reduce((a,x)=>a+(Number(selector(x))||0),0);
const uuid=()=>crypto.randomUUID?crypto.randomUUID():`tl-${Date.now()}-${Math.random().toString(16).slice(2)}`;
function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2600)}
const dialogReturnFocus=new WeakMap();
function showDialog(id,focusSelector){const dialog=typeof id==='string'?$('#'+id):id;if(!dialog)return;if(!dialog.open){dialogReturnFocus.set(dialog,document.activeElement);dialog.showModal()}else if(!dialogReturnFocus.has(dialog)&&dialog._returnFocusTarget)dialogReturnFocus.set(dialog,dialog._returnFocusTarget);const target=focusSelector?dialog.querySelector(focusSelector):dialog.querySelector('input:not([type="hidden"]):not([disabled]),select:not([disabled]),button:not([disabled]),a[href]');if(target)requestAnimationFrame(()=>target.focus({preventScroll:true}))}
function installDialogAccessibility(){$$('dialog').forEach(dialog=>{dialog.addEventListener('close',()=>{const previous=dialogReturnFocus.get(dialog);if(previous&&previous.isConnected&&!previous.disabled)requestAnimationFrame(()=>previous.focus({preventScroll:true}))});dialog.addEventListener('keydown',event=>{if(event.key!=='Tab')return;const items=[...dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el=>!el.hidden&&el.getAttribute('aria-hidden')!=='true'&&el.getClientRects().length);if(!items.length){event.preventDefault();return}const first=items[0],last=items[items.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}})})}
function setFieldError(inputId,errorId,message){const input=$('#'+inputId),error=$('#'+errorId);if(!input||!error)return;input.setAttribute('aria-invalid','true');error.textContent=message;error.hidden=false;input.focus()}
function clearFieldError(inputId,errorId){const input=$('#'+inputId),error=$('#'+errorId);if(!input||!error)return;input.removeAttribute('aria-invalid');error.textContent='';error.hidden=true}
function monthLabel(key){return monthDate(key).toLocaleDateString('en-IN',{month:'long',year:'numeric'})}
function startOfMonth(key){return `${key}-01`}
function safeAmount(v){const text=String(v??'').trim();if(!/^\d+(?:\.\d{1,2})?$/.test(text))return null;const [whole,frac='']=text.split('.');const value=BigInt(whole)*100n+BigInt((frac+'00').slice(0,2));return value>0n&&value<=10000000000n?Number(value):null}
function safeNonnegativeAmount(v){const text=String(v??'').trim();if(!/^\d+(?:\.\d{1,2})?$/.test(text))return null;const [whole,frac='']=text.split('.');const value=BigInt(whole)*100n+BigInt((frac+'00').slice(0,2));return value<=10000000000n?Number(value):null}
function validDate(value){if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const d=new Date(`${value}T12:00:00`);return Number.isFinite(d.getTime())&&dateKey(d)===value}

// IndexedDB: upgrade adds new stores while preserving v1 expenses/settings.
function openDB(){return new Promise((resolve,reject)=>{if(typeof indexedDB==='undefined'||!indexedDB||typeof indexedDB.open!=='function'){reject(new Error('IndexedDB is unavailable in this browser or browsing mode.'));return}let req;try{req=indexedDB.open(DB_NAME,DB_VERSION)}catch(error){reject(error);return}req.onupgradeneeded=()=>{const d=req.result;if(!d.objectStoreNames.contains('expenses'))d.createObjectStore('expenses',{keyPath:'id'});if(!d.objectStoreNames.contains('settings'))d.createObjectStore('settings',{keyPath:'key'});if(!d.objectStoreNames.contains('transactions')){const s=d.createObjectStore('transactions',{keyPath:'id'});s.createIndex('date','date');s.createIndex('type','type');s.createIndex('category','category')}if(!d.objectStoreNames.contains('budgets'))d.createObjectStore('budgets',{keyPath:'id'});if(!d.objectStoreNames.contains('goals'))d.createObjectStore('goals',{keyPath:'id'});if(!d.objectStoreNames.contains('accounts'))d.createObjectStore('accounts',{keyPath:'name'})};req.onblocked=()=>toast('Database upgrade is waiting. Close older Voltura or legacy TapLedger tabs, then return here.');req.onsuccess=()=>{const opened=req.result;opened.onversionchange=()=>opened.close();resolve(opened)};req.onerror=()=>reject(req.error)})}
function storeRequest(store,mode,method,value){return new Promise((resolve,reject)=>{let tx,request,result;try{tx=db.transaction(store,mode);const objectStore=tx.objectStore(store);request=value===undefined?objectStore[method]():objectStore[method](value)}catch(error){reject(error);return}request.onsuccess=()=>{result=request.result};request.onerror=()=>{reject(request.error||new Error('Database request failed.'))};tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(tx.error||request.error||new Error('Database transaction failed.'));tx.onabort=()=>reject(tx.error||new Error('Database transaction was aborted.'))})}
function batchWrite(storeNames,operations){
 return new Promise((resolve,reject)=>{
  let tx,finished=false;
  const fail=error=>{if(finished)return;finished=true;reject(error instanceof Error?error:new Error('Database write failed.'))};
  try{
   if(!db)throw new Error('Local database is not ready.');
   if(!Array.isArray(storeNames)||!storeNames.length||!Array.isArray(operations))throw new TypeError('Invalid database batch.');
   tx=db.transaction(storeNames,'readwrite');
   for(const op of operations){
    if(!op||!storeNames.includes(op.store)||!['put','delete','clear'].includes(op.action))throw new TypeError('Invalid database operation.');
    const store=tx.objectStore(op.store);
    if(op.action==='delete')store.delete(op.key);
    else if(op.action==='clear')store.clear();
    else if(!op.value||typeof op.value!=='object')throw new TypeError('Invalid database record.');
    else store.put(op.value);
   }
  }catch(error){
   if(tx){try{tx.abort()}catch{}}
   fail(error);
   return;
  }
  tx.oncomplete=()=>{if(finished)return;finished=true;resolve()};
  tx.onerror=()=>fail(tx.error||new Error('Database write failed.'));
  tx.onabort=()=>fail(tx.error||new Error('Database write was aborted; no batch records were committed.'));
 });
}
const getAll=store=>storeRequest(store,'readonly','getAll');
const put= (store,value)=>storeRequest(store,'readwrite','put',value);
const del=(store,key)=>storeRequest(store,'readwrite','delete',key);
const getSetting=key=>storeRequest('settings','readonly','get',key);
const setSetting=(key,value)=>put('settings',{key,value});
const getAccounts=()=>getAll('accounts');
async function migrateLegacy(){
  const marker=await getSetting('migration-v3-complete');
  if(marker?.value)return;
  const [legacy,current,existingBudgets,oldBudget]=await Promise.all([
    getAll('expenses'),getAll('transactions'),getAll('budgets'),getSetting('monthlyBudgetPaise')
  ]);
  const existingIds=new Set(current.map(t=>String(t.id)));
  const ops=[];
  for(const old of legacy){
    if(!old||!Number.isSafeInteger(old.amountPaise)||old.amountPaise<=0||!validDate(String(old.spentAt)))continue;
    const id=String(old.id||uuid());
    if(existingIds.has(id))continue;
    existingIds.add(id);
    ops.push({store:'transactions',action:'put',value:{id,type:'expense',amountPaise:old.amountPaise,currency:'INR',category:EXPENSE_CATEGORIES.includes(old.category)?old.category:'Other',merchant:String(old.merchant||''),note:String(old.note||''),date:String(old.spentAt),account:'Imported history',source:'legacy',createdAt:old.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()}});
  }
  if(oldBudget&&Number.isSafeInteger(oldBudget.value)&&oldBudget.value>0&&!existingBudgets.some(b=>b.category==='__overall')){
    ops.push({store:'budgets',action:'put',value:{id:'overall',category:'__overall',limitPaise:oldBudget.value,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}});
  }
  if(ops.length)await batchWrite(['transactions','budgets'],ops);
  await setSetting('migration-v3-complete',true);
}
async function ensureAccounts(){
  const existing=await getAccounts();
  const known=new Set(existing.map(a=>String(a.name).toLocaleLowerCase()));
  const names=new Map();
  for(const [name,kind] of [['Everyday','asset'],['Bank','asset'],['Cash','asset'],['UPI','asset'],['Credit card','liability']])names.set(name,kind);
  if(transactions.some(t=>t.type==='expense'&&['legacy','legacy-backup'].includes(t.source)))names.set('Imported history','historical');
  for(const t of transactions){
    for(const name of [t.account,t.fromAccount,t.toAccount])if(name&&typeof name==='string'&&!names.has(name))names.set(name,/credit|loan|card/i.test(name)?'liability':'asset');
  }
  const additions=[];
  for(const [name,kind] of names)if(!known.has(name.toLocaleLowerCase()))additions.push({name,kind,openingBalancePaise:0,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});
  if(additions.length)await batchWrite(['accounts'],additions.map(value=>({store:'accounts',action:'put',value})));
  accounts=await getAccounts();accounts.sort((a,b)=>a.name.localeCompare(b.name));
}
async function loadAll(){[transactions,budgets,goals]=await Promise.all([getAll('transactions'),getAll('budgets'),getAll('goals')]);transactions.sort((a,b)=>b.date.localeCompare(a.date)||String(b.time||'').localeCompare(String(a.time||''))||String(b.createdAt).localeCompare(String(a.createdAt)));}
function currentItems(){return transactions.filter(x=>monthKey(x.date)===thisMonth())}
function validTransaction(t){if(!t||typeof t.id!=='string'||!t.id.length||t.id.length>120||!['income','expense','transfer'].includes(t.type)||!Number.isSafeInteger(t.amountPaise)||t.amountPaise<=0||t.amountPaise>10000000000||!validDate(t.date)||t.paymentMethod!==undefined&&(typeof t.paymentMethod!=='string'||t.paymentMethod.length>40))return false;if(t.type==='transfer')return typeof t.fromAccount==='string'&&t.fromAccount.length>0&&t.fromAccount.length<=60&&typeof t.toAccount==='string'&&t.toAccount.length>0&&t.toAccount.length<=60&&t.fromAccount!==t.toAccount;const cats=t.type==='income'?INCOME_CATEGORIES:EXPENSE_CATEGORIES;return cats.includes(t.category)&&typeof t.account==='string'&&t.account.length>0&&t.account.length<=60}

// Navigation
const VIEW_LABELS={overview:'Overview',ledger:'Transactions',accounts:'Accounts',budgets:'Budgets'};
function navigate(view){if(!VIEW_LABELS[view])view='overview';selectedView=view;$$('.view').forEach(el=>el.classList.toggle('active',el.id===`view-${view}`));$$('.nav-item[data-view]').forEach(el=>{const active=el.dataset.view===view;el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current')});$('#breadcrumbCurrent').textContent=VIEW_LABELS[view].toUpperCase();document.title=`${VIEW_LABELS[view]} · VOLTURA`;renderView(view);const reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;window.scrollTo({top:0,behavior:reduceMotion?'auto':'smooth'});const heading=$(`#view-${view}`)?.querySelector('h1, .page-title');const announcer=$('#viewAnnouncer');if(announcer)announcer.textContent=`${VIEW_LABELS[view]} view`;if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true})}}
function renderView(view){if(view==='overview')renderOverview();if(view==='ledger')renderLedger();if(view==='accounts')renderAccounts();if(view==='budgets')renderBudgets()}

// Overview calculations and charts
function monthlyTotals(key){const items=transactions.filter(x=>monthKey(x.date)===key);return{income:sum(items.filter(x=>x.type==='income')),expense:sum(items.filter(x=>x.type==='expense')),items}}
function dayCountSoFar(key){return key===thisMonth()?nowDate().getDate():new Date(monthDate(key).getFullYear(),monthDate(key).getMonth()+1,0).getDate()}
function samePeriodPrevious(key){const prev=shiftMonth(key,-1),day=dayCountSoFar(key);return transactions.filter(x=>monthKey(x.date)===prev&&Number(x.date.slice(8,10))<=day)}
const CATEGORY_COLOR={Food:'var(--cat-food)',Transport:'var(--cat-transport)',Shopping:'var(--cat-shopping)',Bills:'var(--cat-bills)',Health:'var(--cat-health)',Education:'var(--cat-education)',Entertainment:'var(--cat-entertainment)',Home:'var(--cat-home)','Personal care':'var(--cat-personal)',Other:'var(--cat-other)'};
function categoryColor(category){return CATEGORY_COLOR[category]||CATEGORY_COLOR.Other}
function accountPositionPaise(){return accounts.filter(account=>account.kind==='asset'||account.kind==='liability').reduce((total,account)=>total+(account.kind==='liability'?-accountBalance(account):accountBalance(account)),0)}
function renderOverview(){
 const key=thisMonth(),totals=monthlyTotals(key),prevItems=samePeriodPrevious(key),prevIn=sum(prevItems.filter(x=>x.type==='income')),prevOut=sum(prevItems.filter(x=>x.type==='expense')),net=totals.income-totals.expense,prevNet=prevIn-prevOut;
 $('#todayLabel').textContent=nowDate().toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'}).toUpperCase();$('#overviewMonth').textContent=nowDate().toLocaleDateString('en-IN',{month:'short',year:'numeric'}).toUpperCase();
 $('#netCashflow').textContent=money(net);$('#moneyIn').textContent=money(totals.income);$('#moneyOut').textContent=money(totals.expense);$('#incomeCount').textContent=`${totals.items.filter(x=>x.type==='income').length} income entries`;$ ('#expenseCount').textContent=`${totals.items.filter(x=>x.type==='expense').length} expense entries`;
 $('#cashflowTrend').textContent=prevItems.length?`${net-prevNet>=0?'↑':'↓'} ${money(Math.abs(net-prevNet))} vs same period last month`:'Add more history to compare';$('#cashflowCaption').textContent=totals.items.length?`${totals.items.length} recorded entries · ${net>=0?'positive':'negative'} net movement`:'Income minus expenses, based on entries you record.';
 const savings=totals.income-totals.expense;$('#accountPosition').textContent=money(accountPositionPaise());
 renderOverviewBudget(totals.expense);renderRecent();
}
function renderOverviewBudget(spent){const overall=budgets.find(b=>b.category==='__overall'),limit=overall?.limitPaise||0,pct=limit?spent/limit*100:0;$('#budgetSpent').textContent=money(spent);$('#budgetOf').textContent=limit?`of ${money(limit)} monthly limit`:'No overall budget set';$('#budgetProgressFill').style.width=`${Math.min(100,pct)}%`;$('#budgetProgressFill').style.background=pct>=100?'var(--color-negative)':pct>=80?'var(--color-warning)':'var(--color-positive)';const progress=$('#budgetProgressBar');if(progress){progress.setAttribute('aria-valuenow',String(Math.min(100,Math.max(0,pct))));progress.setAttribute('aria-valuetext',limit?`${pct.toFixed(0)} percent of monthly expense budget used`:'No monthly budget set')}$('#budgetProgressText').textContent=limit?(pct>=100?'BUDGET EXCEEDED | ':pct>=80?'80% WARNING | ':'')+`${pct.toFixed(0)}% of your monthly limit used`:'Set an overall limit to see your spending pace.';$('#budgetRemaining').textContent=limit?`${money(Math.max(0,limit-spent))} left`:'—';
 const list=budgets.filter(b=>b.category!=='__overall').slice(0,3);$('#miniBudgetList').innerHTML=list.length?list.map(b=>{const used=sum(currentItems().filter(t=>t.type==='expense'&&t.category===b.category));return`<div class="mini-budget-row"><span>${esc(b.category)}</span><strong>${money(used)} / ${money(b.limitPaise)}</strong></div>`}).join(''):'<div class="mini-budget-row"><span>No category budgets yet</span><strong>—</strong></div>'}
function renderRecent(){const rows=transactions.slice().sort((a,b)=>b.date.localeCompare(a.date)||String(b.time||'').localeCompare(String(a.time||''))||String(b.createdAt).localeCompare(String(a.createdAt))).slice(0,4);$('#recentTransactions').innerHTML=rows.length?rows.map(t=>`<div class="recent-row"><span class="category-icon">${transactionIcon(t)}</span><div><div class="recent-title">${esc(t.merchant||t.category||t.type)}</div><div class="recent-sub">${esc(t.category)} · ${fmtDate(t.date)}${t.time?' · '+esc(t.time):''}</div><div class="recent-actions"><button class="recent-action" data-recent-edit="${esc(t.id)}" type="button">Edit</button><button class="recent-action" data-recent-delete="${esc(t.id)}" type="button">Delete</button></div></div><strong class="recent-amount ${t.type}">${t.type==='income'?'+':'−'}${money(t.amountPaise)}</strong></div>`).join(''):'<div class="empty-mini">Your recent activity will appear here. Add your first entry to see it take shape.</div>'}
// Ledger
function categoryOptions(type,selected){const options=type==='income'?INCOME_CATEGORIES:type==='transfer'?['Transfer']:EXPENSE_CATEGORIES;return options.map(c=>`<option ${c===selected?'selected':''}>${esc(c)}</option>`).join('')}
function renderLedger(){const list=filteredTransactions();const totals=transactions.reduce((a,t)=>{if(t.type==='income')a.in+=t.amountPaise;if(t.type==='expense')a.out+=t.amountPaise;return a},{in:0,out:0});$('#ledgerSummary').innerHTML=[['TOTAL INCOME',money(totals.in),'All recorded income'],['TOTAL EXPENSES',money(totals.out),'All recorded expenses'],['NET MOVEMENT',money(totals.in-totals.out),'Income minus expenses']].map(x=>`<div class="summary-tile"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></div>`).join('');
 const selectedCategory=$('#ledgerCategoryFilter').value||'all';const categories=[...new Set(transactions.filter(t=>t.type!=='transfer').map(t=>t.category).filter(Boolean))].sort();$('#ledgerCategoryFilter').innerHTML='<option value="all">All categories</option>'+categories.map(c=>`<option>${esc(c)}</option>`).join('');$('#ledgerCategoryFilter').value=categories.includes(selectedCategory)?selectedCategory:'all';
 $('#ledgerRows').innerHTML=list.map(t=>`<tr><td><div class="table-details"><span class="category-icon">${transactionIcon(t)}</span><div><strong>${esc(t.merchant||t.category||t.type)}</strong><small>${esc(t.note||(t.source==='nfc'?'NFC quick capture':t.type==='income'?'Money received':t.type==='transfer'?'Between your accounts':'Recorded entry'))}</small></div></div></td><td>${fmtDate(t.date)}${t.time?` · ${esc(t.time)}`:''}</td><td><span class="type-chip ${t.type}" style="--ledger-category:${categoryColor(t.category)}">${t.type==='expense'?'<i class="category-chip-dot" aria-hidden="true"></i>':''}${esc(t.category||'Transfer')}</span></td><td>${esc(t.type==='transfer'?`${t.fromAccount||'Everyday'} → ${t.toAccount||'Bank'}`:(t.account||'Everyday'))}${t.paymentMethod?`<small class="payment-method-cell">${esc(t.paymentMethod)}</small>`:''}</td><td class="align-right"><span class="amount-cell ${t.type}">${t.type==='income'?'+':t.type==='expense'?'−':'↔'}${money(t.amountPaise)}</span></td><td><div class="table-actions"><button type="button" class="table-action" data-edit="${esc(t.id)}" aria-label="Edit ${esc(t.merchant||t.category||t.type)} transaction">Edit</button><button type="button" class="table-action delete" data-delete="${esc(t.id)}" aria-label="Delete ${esc(t.merchant||t.category||t.type)} transaction">Delete</button></div></td></tr>`).join('');
 $('#ledgerEmpty').hidden=transactions.length>0&&list.length>0;$('#ledgerEmpty').querySelector('strong').textContent=transactions.length?'No matching transactions.':'Your ledger starts here.';$('#ledgerEmpty').querySelector('p').textContent=transactions.length?'Try a different search or filter.':'Record income or an expense to begin seeing your financial picture.';$('#ledgerRows').closest('.table-wrap').hidden=list.length===0;$('#ledgerFoot').textContent=`${list.length} visible · ${transactions.length} total records`;$('#ledgerFoot').hidden=transactions.length===0||list.length===0}
function filteredTransactions(){const search=$('#ledgerSearch').value.trim().toLowerCase(),type=$('#ledgerTypeFilter').value,cat=$('#ledgerCategoryFilter').value,sort=$('#ledgerSort').value;let list=transactions.filter(t=>(type==='all'||t.type===type)&&(cat==='all'||t.category===cat)&&`${t.merchant} ${t.note} ${t.category} ${t.account} ${t.paymentMethod||''}`.toLowerCase().includes(search));list.sort((a,b)=>sort==='oldest'?a.date.localeCompare(b.date):sort==='highest'?b.amountPaise-a.amountPaise:sort==='lowest'?a.amountPaise-b.amountPaise:b.date.localeCompare(a.date)||String(b.time||'').localeCompare(String(a.time||''))||String(b.createdAt).localeCompare(String(a.createdAt)));return list}

// Accounts: balances are derived from opening balances plus ledger activity.
function accountMovement(account,t){if(account.kind==='historical')return 0;const amount=t.amountPaise;if(account.kind==='liability'){if(t.type==='income'&&t.account===account.name)return-amount;if(t.type==='expense'&&t.account===account.name)return amount;if(t.type==='transfer'&&t.fromAccount===account.name)return amount;if(t.type==='transfer'&&t.toAccount===account.name)return-amount;return 0}if(t.type==='income'&&t.account===account.name)return amount;if(t.type==='expense'&&t.account===account.name)return-amount;if(t.type==='transfer'&&t.fromAccount===account.name)return-amount;if(t.type==='transfer'&&t.toAccount===account.name)return amount;return 0}
function accountBalance(account){if(account.kind==='historical')return sum(transactions.filter(t=>t.account===account.name&&t.type==='expense'));return (Number(account.openingBalancePaise)||0)+transactions.reduce((total,t)=>total+accountMovement(account,t),0)}
function renderAccounts(){const balances=accounts.map(a=>({...a,balancePaise:accountBalance(a)})),assets=balances.filter(a=>a.kind==='asset').reduce((n,a)=>n+a.balancePaise,0),liabilities=balances.filter(a=>a.kind==='liability').reduce((n,a)=>n+a.balancePaise,0),netWorth=assets-liabilities;$('#accountsSummary').innerHTML=[['NET POSITION',money(netWorth),'Tracked assets minus tracked liabilities'],['ASSETS',money(assets),'Cash, bank and wallet accounts'],['CREDIT / LOAN BALANCE',money(liabilities),'Tracked amounts owed']].map(x=>`<div class="summary-tile"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></div>`).join('');$('#accountsGrid').innerHTML=balances.length?balances.map(a=>{const used=transactions.filter(t=>t.account===a.name||t.fromAccount===a.name||t.toAccount===a.name).length;const meta=a.kind==='liability'?{icon:'◇',color:'#a66c5b'}:a.kind==='historical'?{icon:'◷',color:'#9b998c'}:{icon:'▣',color:'#526d85'};const system=['Everyday','Bank','Cash','UPI','Credit card'].includes(a.name);return`<article class="account-card ${a.kind==='historical'?'historical-account':''}"><div class="account-card-head"><span class="account-symbol" style="color:${meta.color}">${meta.icon}</span><span class="account-kind">${a.kind==='liability'?'CREDIT / LIABILITY':a.kind==='historical'?'UNASSIGNED HISTORY':'CASH / ASSET'}</span><div class="account-actions">${a.kind==='historical'?'<span class="system-account-label">ARCHIVE</span>':`<button type="button" data-edit-account="${esc(a.name)}">EDIT</button>${system?'<span class="system-account-label">SYSTEM</span>':`<button type="button" data-delete-account="${esc(a.name)}">REMOVE</button>`}`}</div></div><h3>${esc(a.name)}</h3><div class="account-balance-label">${a.kind==='liability'?'CURRENT AMOUNT OWED':a.kind==='historical'?'HISTORICAL SPENDING · NOT A LIVE BALANCE':'CURRENT BALANCE'}</div><strong class="account-balance">${money(a.balancePaise)}</strong><div class="account-card-foot"><span>${a.kind==='historical'?'EXCLUDED FROM NET POSITION':`OPENING ${money(a.openingBalancePaise||0)}`}</span><span>${used} ledger ${used===1?'entry':'entries'}</span></div></article>`}).join(''):'<div class="goal-empty-state"><h3>No accounts yet.</h3><p>Add an account to begin calculating balances.</p></div>';populateAccountSelects()}
function populateAccountSelects(selected={}){const names=accounts.filter(a=>a.kind!=='historical').map(a=>a.name);const fill=(id,value)=>{const el=$('#'+id);if(!el)return;const current=value||el.value;el.innerHTML=names.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join('');el.value=names.includes(current)?current:(names[0]||'')};fill('entryAccount',selected.account||'Everyday');fill('transferFrom',selected.fromAccount||'Everyday');fill('transferTo',selected.toAccount||'Bank')}
function openAccount(account){$('#accountForm').reset();$('#accountOriginalName').value=account?.name||'';$('#accountDialogTitle').textContent=account?'Edit account':'Add an account';$('#accountName').value=account?.name||'';$('#accountName').disabled=!!account;$('#accountKind').value=account?.kind||'asset';$('#accountKind').disabled=!!account;$('#accountOpening').value=account?(Number(account.openingBalancePaise||0)/100).toFixed(2):'0.00';$('#accountHelp').textContent=account?'Account name and kind stay fixed so historical entries keep their meaning. You can adjust the opening balance.':'For an asset, enter money you own. For a liability, enter the amount you currently owe.';showDialog('accountDialog')}
async function saveAccount(e){e.preventDefault();const original=$('#accountOriginalName').value,name=$('#accountName').value.trim(),kind=$('#accountKind').value,opening=safeNonnegativeAmount($('#accountOpening').value);if(!name||!opening&&opening!==0){toast('Enter a valid account name and opening balance.');return}if(name.length>40||!['asset','liability'].includes(kind)){toast('Check the account details.');return}if(!original&&accounts.some(a=>a.name.toLowerCase()===name.toLowerCase())){toast('An account with this name already exists.');return}const account=original?accounts.find(a=>a.name===original):null;const record={...(account||{}),name:original||name,kind:account?.kind||kind,openingBalancePaise:opening,createdAt:account?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()};try{await put('accounts',record);accounts=await getAccounts();accounts.sort((a,b)=>a.name.localeCompare(b.name));$('#accountDialog').close();populateAccountSelects();renderAll();toast(original?'Opening balance updated.':'Account added.')}catch(err){console.error(err);toast('Could not save the account.')}}
async function deleteAccount(name){const account=accounts.find(a=>a.name===name);if(!account)return;if(['Everyday','Bank','Cash','UPI','Credit card'].includes(name)){toast('Built-in accounts cannot be removed. You can leave them at zero.');return;}const used=transactions.some(t=>t.account===name||t.fromAccount===name||t.toAccount===name);if(used){toast('This account is used by ledger entries. Remove or reassign those entries first.');return}if(!confirm(`Remove account “${name}”? This does not change your transactions.`))return;try{await del('accounts',name);accounts=await getAccounts();renderAll();populateAccountSelects();toast('Account removed.')}catch(err){console.error(err);toast('Could not remove the account.')}}

// Budgets
function budgetUsed(b){return sum(currentItems().filter(t=>t.type==='expense'&&(b.category==='__overall'||t.category===b.category)))}
function renderBudgets(){const overall=budgets.find(b=>b.category==='__overall'),spent=sum(currentItems().filter(t=>t.type==='expense')),catBudgets=budgets.filter(b=>b.category!=='__overall'),limit=overall?.limitPaise||0;$('#budgetPageSummary').innerHTML=[['THIS MONTH',money(spent),'Recorded expenses'],['OVERALL LIMIT',limit?money(limit):'Not set',limit?'Monthly spending guardrail':'Add an overall budget'],['LIMIT REMAINING',limit?money(Math.max(0,limit-spent)):'—',limit?`${Math.min(100,spent/limit*100).toFixed(0)}% used`:'No limit to compare']].map(x=>`<div class="summary-tile"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></div>`).join('');$('#budgetMonthLabel').textContent=monthLabel(thisMonth()).toUpperCase();
 const all=[...(overall?[overall]:[]),...catBudgets];$('#budgetCards').innerHTML=all.length?all.map(b=>{const used=budgetUsed(b),pct=used/b.limitPaise*100,remain=b.limitPaise-used,state=VolturaFinance.budgetStatus(used,b.limitPaise),status=state==='exceeded'?'BUDGET EXCEEDED':state==='warning'?'80% WARNING':'WITHIN LIMIT',cat=b.category==='__overall'?'Overall budget':b.category,meta=META[cat]||{icon:'◎',color:'#8b8c82'};return`<article class="budget-card"><div class="budget-card-top"><div class="budget-category"><span class="budget-cat-icon" style="color:${meta.color}">${meta.icon}</span><div><strong>${esc(cat)}</strong><small>${b.category==='__overall'?'All expense categories':'Category limit'}</small></div></div><div class="budget-card-actions"><button type="button" data-edit-budget="${esc(b.id)}" aria-label="Edit ${esc(cat)} budget">Edit</button><button type="button" data-delete-budget="${esc(b.id)}" aria-label="Remove ${esc(cat)} budget">Remove</button></div></div><div class="budget-values"><strong>${money(used)}</strong><span>of ${money(b.limitPaise)}</span></div><div class="budget-bar"><i class="${state!=='within'?'warn':''}" style="width:${Math.min(100,pct)}%"></i></div><div class="budget-foot budget-state-${state}"><span>${status} | ${pct.toFixed(0)}% USED</span><span>${remain>=0?money(remain)+' remaining':money(-remain)+' over limit'}</span></div></article>`}).join(''):'<div class="goal-empty-state"><span>⌑</span><h3>Give your spending some shape.</h3><p>Create an overall monthly budget or start with one category.</p><button class="button button-primary" id="firstBudgetButton">Create a budget</button></div>';$('#firstBudgetButton')?.addEventListener('click',()=>openBudget());}
function openBudget(b){$('#budgetForm').reset();$('#budgetId').value=b?.id||'';$('#budgetDialogTitle').textContent=b?'Edit budget':'Set a budget';$('#budgetCategory').value=b?.category||'__overall';$('#budgetAmount').value=b?(b.limitPaise/100):'';showDialog('budgetDialog')}
async function saveBudget(e){e.preventDefault();const category=$('#budgetCategory').value,amount=safeAmount($('#budgetAmount').value);if(!amount){toast('Enter a valid budget amount.');return}const id=$('#budgetId').value||`budget-${category}`;const old=budgets.find(x=>x.id===id)||{};const b={...old,id,category,limitPaise:amount,createdAt:old.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()};try{await put('budgets',b);budgets=await getAll('budgets');$('#budgetDialog').close();renderAll();toast('Budget saved.')}catch(err){console.error(err);toast('Could not save the budget.')}}
async function deleteBudget(id){const b=budgets.find(x=>x.id===id);if(!b||!confirm(`Remove the ${b.category==='__overall'?'overall':b.category} budget? Your transactions will stay intact.`))return;try{await del('budgets',id);budgets=await getAll('budgets');renderAll();toast('Budget removed.')}catch(err){console.error(err);toast('Could not remove the budget.')}}

// Entry form
function setEntryType(type){$('#entryType').value=type;$$('.type-tab').forEach(b=>b.classList.toggle('active',b.dataset.type===type));const choices=type==='income'?INCOME_CATEGORIES:type==='transfer'?['Transfer']:EXPENSE_CATEGORIES;$('#entryCategory').innerHTML=choices.map(c=>'<option>'+esc(c)+'</option>').join('');$('#entryDialogTitle').textContent=type==='income'?'Record income':type==='transfer'?'Record a transfer':'Log an expense';$('#entryMerchant').placeholder=type==='income'?'e.g. Monthly salary':type==='transfer'?'e.g. Move to savings':'e.g. Local Cafe';$('#entryCategoryField').hidden=type==='transfer';$('#entryAccountField').hidden=type==='transfer';$('#entryPaymentField').hidden=type==='transfer';$('#transferFields').hidden=type!=='transfer'}
function openEntry(options={}){const type=options.type||'expense';sourceForNext=options.source||'manual';$('#entryForm').reset();$('#entryForm').classList.remove('is-launch-loading');$('#entryLaunchLoading').hidden=true;$('#entryForm').dataset.ready='true';$('#entryForm').querySelector('button[type="submit"]').disabled=false;populateAccountSelects(options.item||{});$('#entryId').value=options.item?.id||'';setEntryType(options.item?.type||type);$('#entryAmount').value=options.item?(options.item.amountPaise/100).toFixed(2):options.amount||'';$('#entryCategory').value=options.item?.category||options.category||((type==='income')?'Salary':'Food');$('#entryDate').value=options.item?.date||today();$('#entryTime').value=options.item?.time||'';$('#entryMerchant').value=options.item?.merchant||options.merchant||'';$('#entryPaymentMethod').value=options.item?.paymentMethod||'';$('#entryAccount').value=options.item?.account||'Everyday';$('#transferFrom').value=options.item?.fromAccount||'Everyday';$('#transferTo').value=options.item?.toAccount||'Bank';$('#entryNote').value=options.item?.note||'';$('#entrySourceLabel').textContent=sourceForNext==='nfc'?' / NFC TAP':sourceForNext==='voice'?' / VOICE':' / MANUAL';showDialog('entryDialog','#entryAmount')}async function saveEntry(e){e.preventDefault();const id=$('#entryId').value,type=$('#entryType').value,amount=safeAmount($('#entryAmount').value),date=$('#entryDate').value,category=$('#entryCategory').value;if(!amount){setFieldError('entryAmount','entryAmountError','Enter an amount greater than zero, with no more than two decimal places.');return}else clearFieldError('entryAmount','entryAmountError');if(!validDate(date)){setFieldError('entryDate','entryDateError','Choose a real calendar date.');return}else clearFieldError('entryDate','entryDateError');const old=transactions.find(t=>t.id===id);const item={id:id||uuid(),type,amountPaise:amount,currency:CURRENCY,category:type==='transfer'?'Transfer':category,merchant:$('#entryMerchant').value.trim(),paymentMethod:type==='transfer'?'':$('#entryPaymentMethod').value,note:$('#entryNote').value.trim(),date,time:/^(?:[01]\d|2[0-3]):[0-5]\d$/.test($('#entryTime').value)?$('#entryTime').value:'',account:type==='transfer'?$('#transferFrom').value:$('#entryAccount').value,fromAccount:type==='transfer'?$('#transferFrom').value:undefined,toAccount:type==='transfer'?$('#transferTo').value:undefined,source:old?.source||sourceForNext,createdAt:old?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()};if(type==='transfer'&&item.fromAccount===item.toAccount){toast('Choose two different accounts for a transfer.');return}if(type!=='transfer'&&!accounts.some(a=>a.name===item.account)){toast('Choose a valid account.');return}if(type==='transfer'&&(!accounts.some(a=>a.name===item.fromAccount)||!accounts.some(a=>a.name===item.toAccount))){toast('Choose two valid accounts for a transfer.');return}if(!validTransaction(item)){toast('Please check the transaction details.');return}try{await put('transactions',item);transactions=await getAll('transactions');transactions.sort((a,b)=>b.date.localeCompare(a.date)||String(b.time||'').localeCompare(String(a.time||'')));$('#entryDialog').close();renderAll();toast(old?'Transaction updated.':'Transaction saved.')}catch(err){console.error(err);toast('Unable to save. Export a backup and try again.')}}
async function handleEntrySubmit(event){if(entrySaving){event.preventDefault();return}entrySaving=true;const button=event.submitter||$('#entryForm').querySelector('button[type="submit"]'),wasDisabled=button?.disabled||false;if(button)button.disabled=true;try{await saveEntry(event)}catch(err){console.error(err);toast('Unable to save. Export a backup and try again.')}finally{entrySaving=false;if(button)button.disabled=wasDisabled}}
async function deleteTransaction(id){const t=transactions.find(x=>x.id===id);if(!t||!confirm(`Delete ${t.merchant||t.category} · ${money(t.amountPaise)}? This cannot be undone without a backup.`))return;try{await del('transactions',id);transactions=await getAll('transactions');renderAll();toast('Transaction deleted.')}catch(err){console.error(err);toast('Could not delete the transaction.')}}
function preferredQuickCategories(){
 const counts=new Map(EXPENSE_CATEGORIES.map(category=>[category,{count:0,last:'0000-00-00'}]));
 for(const item of transactions){if(item.type!=='expense'||!counts.has(item.category))continue;const value=counts.get(item.category);value.count+=1;if(item.date>value.last)value.last=item.date}
 const ranked=EXPENSE_CATEGORIES.slice().sort((a,b)=>{const av=counts.get(a),bv=counts.get(b);return bv.count-av.count||bv.last.localeCompare(av.last)||EXPENSE_CATEGORIES.indexOf(a)-EXPENSE_CATEGORIES.indexOf(b)});
 const top=ranked.filter(category=>counts.get(category).count>0).slice(0,8);
 if(top.length<8)for(const category of ranked){if(!top.includes(category))top.push(category);if(top.length===8)break}
 if(quickExpenseCategory&&!top.includes(quickExpenseCategory))top[7]=quickExpenseCategory;
 return top;
}
function renderQuickCategoryChoices(){const host=$('#quickCategoryChoices');if(!host)return;host.innerHTML=preferredQuickCategories().map(category=>`<button type="button" class="quick-category-chip${category===quickExpenseCategory?' active':''}" data-quick-category="${esc(category)}" aria-pressed="${category===quickExpenseCategory?'true':'false'}"><span aria-hidden="true">${esc((META[category]||META.Other).icon)}</span>${esc(category)}</button>`).join('')}
function setQuickExpenseCategory(category,manual=false){if(!EXPENSE_CATEGORIES.includes(category))return;quickExpenseCategory=category;if(manual)quickCategoryTouched=true;$$('[data-quick-category]').forEach(button=>{const active=button.dataset.quickCategory===category;button.classList.toggle('active',active);button.setAttribute('aria-pressed',active?'true':'false')});if(manual){haptic('tap');const feedback=$('#quickFeedback');if(feedback)feedback.textContent=`${category} selected.`}}
function localDateTimeValue(date=new Date()){const pad=n=>String(n).padStart(2,'0');return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`}
function validLocalDateTime(value){if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value))return false;const [date,time]=value.split('T');return validDate(date)&&/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)}
function showQuickForm(){const fields=$('#quickExpenseFields'),success=$('#quickExpenseSuccess');if(fields)fields.hidden=false;if(success)success.hidden=true;$('#quickExpenseError').hidden=true;$('#quickExpenseSave').disabled=false;$('#quickExpenseSave').innerHTML='<span>Save expense</span><b aria-hidden="true">↗</b>';}
async function openQuickExpense(options={}){
 const form=$('#quickExpenseForm');if(!form)return;form.reset();quickExpenseSaving=false;quickCategoryTouched=false;lastQuickSavedId='';clearTimeout(quickUndoTimer);quickUndoTimer=0;showQuickForm();$('#quickExpenseFields').hidden=true;$('#quickExpenseLoading').hidden=false;
 $('#quickExpenseDateTime').value=localDateTimeValue();$('#quickFeedback').textContent='';$('#quickExpenseError').hidden=true;$('#quickExpenseError').textContent='';
 const [lastCategory,lastAccount]=await Promise.all([getSetting('nfc-last-category-v1').catch(()=>null),getSetting('nfc-last-account-v1').catch(()=>null)]);
 const eligible=accounts.filter(account=>account.kind!=='historical').map(account=>account.name);
 quickExpenseCategory=EXPENSE_CATEGORIES.includes(lastCategory?.value)?lastCategory.value:(preferredQuickCategories()[0]||'Food');
 const selected=eligible.includes(lastAccount?.value)?lastAccount.value:(eligible.includes('Everyday')?'Everyday':(eligible[0]||''));
 $('#quickExpenseAccount').innerHTML=eligible.map(name=>`<option value="${esc(name)}">${esc(name)}</option>`).join('');$('#quickExpenseAccount').value=selected;
 renderQuickCategoryChoices();setQuickExpenseCategory(quickExpenseCategory);$('#quickExpenseLoading').hidden=true;$('#quickExpenseFields').hidden=false;const quickForm=$('#quickExpenseForm');if(quickForm)quickForm.dataset.ready='true';$('#quickExpenseSave').disabled=false;showDialog('quickExpenseDialog','#quickExpenseAmount');
}
async function saveQuickExpense(event){
 event.preventDefault();if(quickExpenseSaving)return;
 const amount=safeAmount($('#quickExpenseAmount').value),dateTime=$('#quickExpenseDateTime').value,account=$('#quickExpenseAccount').value,error=$('#quickExpenseError');
 if(!amount){error.textContent='Enter an amount above ₹0 and no more than ₹10 crore, using at most two decimal places.';error.hidden=false;$('#quickExpenseAmount').setAttribute('aria-invalid','true');$('#quickExpenseAmount').focus();haptic('error');return}
 $('#quickExpenseAmount').removeAttribute('aria-invalid');
 if(!validLocalDateTime(dateTime)){error.textContent='Choose a valid date and time.';error.hidden=false;$('#quickExpenseDateTime').setAttribute('aria-invalid','true');$('#quickExpenseDateTime').focus();haptic('error');return}
 $('#quickExpenseDateTime').removeAttribute('aria-invalid');
 if(!accounts.some(item=>item.name===account)){error.textContent='Choose a valid payment account.';error.hidden=false;$('#quickExpenseAccount').focus();haptic('error');return}
 error.hidden=true;const [date,time]=dateTime.split('T');const savedAt=new Date().toISOString();
 const item={id:uuid(),type:'expense',amountPaise:amount,currency:CURRENCY,category:quickExpenseCategory,merchant:$('#quickExpenseMerchant').value.trim(),note:$('#quickExpenseNote').value.trim(),date,time,account,source:'nfc',createdAt:savedAt,updatedAt:savedAt};
 if(!validTransaction(item)){error.textContent='Please check the expense details.';error.hidden=false;return}
 quickExpenseSaving=true;const button=$('#quickExpenseSave');button.disabled=true;button.innerHTML='<span>Saving…</span><b aria-hidden="true">···</b>';
 try{
  await put('transactions',item);transactions=await getAll('transactions');transactions.sort((a,b)=>b.date.localeCompare(a.date)||String(b.time||'').localeCompare(String(a.time||''))||String(b.createdAt).localeCompare(String(a.createdAt)));
  await Promise.all([setSetting('nfc-last-category-v1',quickExpenseCategory),setSetting('nfc-last-account-v1',account)]).catch(err=>console.warn('Could not remember quick-entry defaults:',err));
  lastQuickSavedId=item.id;quickExpenseSaving=false;renderAll();
  $('#quickExpenseFields').hidden=true;$('#quickExpenseSuccess').hidden=false;$('#quickExpenseSavedTitle').textContent='Saved ✓';$('#quickExpenseSavedSummary').textContent=`${money(item.amountPaise)} · ${item.category}${item.merchant?' · '+item.merchant:''} · ${fmtDate(item.date)}${item.time?' at '+item.time:''}`;
  const undo=$('#undoQuickExpense');undo.disabled=false;undo.textContent='Undo (5 seconds)';$('#quickUndoStatus').textContent='You can undo this save for about 5 seconds.';
  haptic('success');
  clearTimeout(quickUndoTimer);quickUndoTimer=setTimeout(()=>{undo.disabled=true;undo.textContent='Undo expired';$('#quickUndoStatus').textContent='Undo window ended. The expense remains in your ledger.';lastQuickSavedId=''},5000);
 }catch(err){console.error(err);error.textContent='Could not save this expense. Your other ledger entries are unchanged.';error.hidden=false;button.disabled=false;button.innerHTML='<span>Try again</span><b aria-hidden="true">↗</b>';quickExpenseSaving=false;haptic('error')}
}
async function undoQuickExpense(){if(!lastQuickSavedId)return;const id=lastQuickSavedId;clearTimeout(quickUndoTimer);quickUndoTimer=0;try{await del('transactions',id);transactions=await getAll('transactions');transactions.sort((a,b)=>b.date.localeCompare(a.date)||String(b.time||'').localeCompare(String(a.time||''))||String(b.createdAt).localeCompare(String(a.createdAt)));lastQuickSavedId='';renderAll();$('#quickExpenseSuccess').hidden=true;$('#quickExpenseFields').hidden=false;$('#quickUndoStatus').textContent='Save undone. Review or edit the entry, then save again.';$('#quickExpenseError').textContent='The last save was undone.';$('#quickExpenseError').hidden=false;$('#quickFeedback').textContent='Save undone. You can edit the entry and try again.';$('#quickExpenseSave').disabled=false;$('#quickExpenseSave').innerHTML='<span>Save expense</span><b aria-hidden="true">↗</b>';$('#quickExpenseAmount').focus();haptic('tap');toast('Last expense undone.')}catch(error){console.error(error);toast('Could not undo this expense. Check your ledger.')}}
function addAnotherQuickExpense(){clearTimeout(quickUndoTimer);quickUndoTimer=0;lastQuickSavedId='';void openQuickExpense()}
function finishQuickExpense(){clearTimeout(quickUndoTimer);quickUndoTimer=0;$('#quickExpenseDialog').close();navigate('overview');$('#main-content').focus?.()}
function applyUrlAction(){const p=new URLSearchParams(location.search);const intent=window.__volturaLaunchIntent;const type=intent?.type||(p.get('a')==='1'||p.get('add')==='1'?'expense':p.get('i')==='1'?'income':'');if(!type)return;delete window.__volturaLaunchIntent;history.replaceState({},document.title,location.pathname+location.hash);if(type==='expense')openQuickExpense();else openEntry({type,source:'nfc'})}
function inferCategory(text,type='expense'){const value=String(text||'').toLowerCase();if(type==='income'){if(/salary|payroll|stipend/.test(value))return'Salary';if(/freelance|client|project/.test(value))return'Freelance';if(/refund|returned/.test(value))return'Refund';if(/interest/.test(value))return'Interest';if(/gift/.test(value))return'Gift';return'Other'}return VolturaFinance.inferMerchantCategory(text)||'Other'}
// Local display preferences. The settings store is part of the existing v3 DB.
function haptic(kind='tap'){
 if(!hapticEnabled||typeof navigator.vibrate!=='function')return;
 const patterns={tap:10,success:[15,20,25],error:[40,20,30]};
 try{navigator.vibrate(patterns[kind]||patterns.tap)}catch{}
}
let systemThemeListenerInstalled=false;
function applyThemePreference(value){
 const allowed=['system','light','dark'];
 const theme=allowed.includes(value)?value:'system';
 const systemQuery=typeof matchMedia==='function'?matchMedia('(prefers-color-scheme: dark)'):null;
 const dark=theme==='dark'||(theme==='system'&&!!systemQuery?.matches);
 document.documentElement.dataset.theme=dark?'dark':'light';
 document.documentElement.dataset.themePreference=theme;
 const themeMeta=document.querySelector('meta[name="theme-color"]');
 if(themeMeta)themeMeta.content=dark?'#101a15':'#f0eee6';
 const select=$('#themePreference');if(select&&select.value!==theme)select.value=theme;
 if(!systemThemeListenerInstalled&&systemQuery?.addEventListener){
  systemQuery.addEventListener('change',()=>{if(document.documentElement.dataset.themePreference==='system')applyThemePreference('system')});
  systemThemeListenerInstalled=true;
 }
}
async function loadUserPreferences(){
 let theme='system';
 try{const value=await getSetting('theme-pref-v1');theme=value?.value||'system'}catch(error){console.warn('Could not read display preferences:',error)}
 applyThemePreference(theme);hapticEnabled=false;
 const themeSelect=$('#themePreference');if(themeSelect)themeSelect.value=theme;
 const themeSelect=$('#themePreference');if(themeSelect)themeSelect.value=theme;
}
async function saveThemePreference(value){applyThemePreference(value);try{await setSetting('theme-pref-v1',value);$('#preferenceStatus').textContent='Appearance preference saved on this device.'}catch(error){console.error(error);$('#preferenceStatus').textContent='Could not save this preference.'}}

// Data tools
function csvCell(value){let s=String(value??'');if(/^[\s\u0000-\u001f]*[=+\-@]/.test(s))s="'"+s;return`"${s.replace(/"/g,'""')}"`}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function exportCSV(){const rows=[['Date','Time','Type','Amount INR','Category','Merchant','Account','Payment method','Receipt note','Source','ID']];transactions.slice().sort((a,b)=>a.date.localeCompare(b.date)).forEach(t=>rows.push([t.date,t.time||'',t.type,(t.amountPaise/100).toFixed(2),t.category,t.merchant,t.account,t.paymentMethod||'',t.note,t.source,t.id]));download(new Blob(['\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}),`voltura-ledger-${today()}.csv`);toast('CSV export prepared.')}
async function backupJSON(){const data={app:'Voltura',schemaVersion:8,exportedAt:new Date().toISOString(),currency:CURRENCY,transactions,budgets,goals,accounts};download(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),`voltura-backup-${today()}.json`);toast('Backup downloaded.')}
function sanitizeTransaction(t){if(!validTransaction(t))return null;return{id:String(t.id),type:t.type,amountPaise:t.amountPaise,currency:'INR',category:t.type==='transfer'?'Transfer':String(t.category),merchant:String(t.merchant||'').slice(0,90),paymentMethod:String(t.paymentMethod||'').slice(0,40),note:String(t.note||'').slice(0,180),date:t.date,time:/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(String(t.time||''))?String(t.time):'',account:t.type==='transfer'?'':String(t.account),fromAccount:t.type==='transfer'?String(t.fromAccount):undefined,toAccount:t.type==='transfer'?String(t.toAccount):undefined,source:String(t.source||'import').slice(0,30),createdAt:String(t.createdAt||new Date().toISOString()),updatedAt:String(t.updatedAt||new Date().toISOString())}}
function additiveRestore(stores,incoming){
 return new Promise((resolve,reject)=>{
  let tx;
  let remaining=stores.length;
  let finished=false;
  let restoreCounts={};
  const current={};
  try {
   tx=db.transaction(stores,'readwrite');
   const fail=error=>{if(finished)return;finished=true;try{tx.abort()}catch{}reject(error)};
   for(const name of stores){
    const request=tx.objectStore(name).getAll();
    request.onsuccess=()=>{
     current[name]=request.result;
     remaining-=1;
     if(remaining!==0)return;
     try {
      const existingAccounts=current.accounts||[];
      const accountByKey=new Map(existingAccounts.map(a=>[String(a.name).toLocaleLowerCase(),a.name]));
      const accountAliases=new Map();
      for(const account of incoming.accounts||[]){
       const key=String(account.name).toLocaleLowerCase();
       accountAliases.set(key,accountByKey.get(key)||account.name);
      }
      const normalizeAccount=name=>{
       if(!name)return name;
       const key=String(name).toLocaleLowerCase();
       return accountByKey.get(key)||accountAliases.get(key)||name;
      };
      const txRows=(incoming.transactions||[]).map(item=>item.type==='transfer'
       ?{...item,fromAccount:normalizeAccount(item.fromAccount),toAccount:normalizeAccount(item.toAccount)}
       :{...item,account:normalizeAccount(item.account)});
      const planTx=VolturaFinance.planAdditiveRecords(current.transactions||[],txRows,item=>item.id);
      const occupiedBudgetIds=new Set((current.budgets||[]).map(item=>String(item.id)));
      const occupiedBudgetCategories=new Set((current.budgets||[]).map(item=>String(item.category).toLocaleLowerCase()));
      const seenBudgetCategories=new Set();
      const budgetAdds=[];
      let budgetConflicts=0;
      for(const budget of incoming.budgets||[]){
       const key=String(budget.category).toLocaleLowerCase();
       if(occupiedBudgetIds.has(String(budget.id))||occupiedBudgetCategories.has(key)||seenBudgetCategories.has(key)){budgetConflicts+=1;continue;}
       seenBudgetCategories.add(key);budgetAdds.push(budget);
      }
      const planGoals=VolturaFinance.planAdditiveRecords(current.goals||[],incoming.goals||[],item=>item.id);
      const planAccounts=VolturaFinance.planAdditiveRecords(existingAccounts,incoming.accounts||[],item=>String(item.name).toLocaleLowerCase());
      const accountAdds=planAccounts.additions.filter(item=>!accountByKey.has(String(item.name).toLocaleLowerCase()));
      const addRows=(store,rows)=>{for(const value of rows)tx.objectStore(store).add(value);};
      addRows('transactions',planTx.additions);
      addRows('budgets',budgetAdds);
      addRows('goals',planGoals.additions);
      addRows('accounts',accountAdds);
      restoreCounts={
       transactions:planTx.additions.length,transactionConflicts:planTx.conflicts,transactionDuplicates:planTx.duplicates,
       budgets:budgetAdds.length,budgetConflicts,goals:planGoals.additions.length,goalConflicts:planGoals.conflicts,
       goalDuplicates:planGoals.duplicates,accounts:accountAdds.length,accountConflicts:planAccounts.conflicts+planAccounts.duplicates
      };
     } catch(error){fail(error);}
    };
    request.onerror=()=>fail(request.error||new Error('Could not inspect existing records.'));
   }
  } catch(error){reject(error);return;}
  tx.oncomplete=()=>{if(finished)return;finished=true;resolve(restoreCounts);};
  tx.onerror=()=>{if(finished)return;finished=true;reject(tx.error||new Error('Restore transaction failed.'));};
  tx.onabort=()=>{if(finished)return;finished=true;reject(tx.error||new Error('Restore was aborted; no imported records were committed.'));};
 });
}
async function restoreJSON(file){
 if(!file)return;
 try{
  const data=JSON.parse(await file.text());
  if(!data||!['Voltura','Vellum','Cairn','TapLedger'].includes(data.app))throw new Error('This is not a supported Voltura or legacy Cairn/TapLedger/Vellum backup.');
  const txs=[];
  if(Array.isArray(data.transactions)){for(const raw of data.transactions){const t=sanitizeTransaction(raw);if(t)txs.push(t)}}
  else if(Array.isArray(data.expenses)){for(const old of data.expenses){if(!old||!Number.isSafeInteger(old.amountPaise)||old.amountPaise<=0||!validDate(String(old.spentAt)))continue;const t=sanitizeTransaction({id:String(old.id||uuid()),type:'expense',amountPaise:old.amountPaise,category:EXPENSE_CATEGORIES.includes(old.category)?old.category:'Other',merchant:String(old.merchant||''),note:String(old.note||''),date:String(old.spentAt),account:'Everyday',source:'legacy-backup',createdAt:old.createdAt||new Date().toISOString()});if(t)txs.push(t)}}
  else if(!Array.isArray(data.budgets)&&!Array.isArray(data.goals))throw new Error('Backup contains no supported transaction, budget or goal data.');
  const budgets=[];let invalid=0;
  if(Array.isArray(data.budgets))for(const b of data.budgets){if(b&&typeof b.id==='string'&&b.id.length<=80&&Number.isSafeInteger(b.limitPaise)&&b.limitPaise>0&&(b.category==='__overall'||EXPENSE_CATEGORIES.includes(b.category)))budgets.push({id:b.id,category:b.category,limitPaise:b.limitPaise,createdAt:String(b.createdAt||new Date().toISOString()),updatedAt:String(b.updatedAt||new Date().toISOString())});else invalid++}
  if(Number.isSafeInteger(data.monthlyBudgetPaise)&&data.monthlyBudgetPaise>0&&!budgets.some(b=>b.category==='__overall'))budgets.push({id:'overall',category:'__overall',limitPaise:data.monthlyBudgetPaise,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});
  const goals=[];if(Array.isArray(data.goals))for(const g of data.goals){if(g&&typeof g.id==='string'&&g.id.length<=100&&typeof g.name==='string'&&g.name.trim()&&Number.isSafeInteger(g.targetPaise)&&g.targetPaise>0&&Number.isSafeInteger(g.savedPaise)&&g.savedPaise>=0&&g.savedPaise<=g.targetPaise&&(!g.targetDate||validDate(g.targetDate)))goals.push({id:g.id,name:g.name.trim().slice(0,70),targetPaise:g.targetPaise,savedPaise:g.savedPaise,targetDate:g.targetDate||'',note:String(g.note||'').slice(0,140),createdAt:String(g.createdAt||new Date().toISOString()),updatedAt:String(g.updatedAt||new Date().toISOString())});else invalid++}
  const accounts=[];if(Array.isArray(data.accounts))for(const a of data.accounts){if(a&&typeof a.name==='string'&&a.name.trim()&&a.name.length<=40&&['asset','liability','historical'].includes(a.kind)&&Number.isSafeInteger(a.openingBalancePaise)&&a.openingBalancePaise>=0&&a.openingBalancePaise<=10000000000)accounts.push({name:a.name.trim(),kind:a.kind,openingBalancePaise:a.openingBalancePaise,createdAt:String(a.createdAt||new Date().toISOString()),updatedAt:String(a.updatedAt||new Date().toISOString())});else invalid++}
  if(!txs.length&&!budgets.length&&!goals.length&&!accounts.length)throw new Error('No valid records were found in this backup. Nothing was changed.');
  const counts=await additiveRestore(['transactions','budgets','goals','accounts'],{transactions:txs,budgets,goals,accounts});
  await loadAll();await ensureAccounts();renderAll();
  const skipped=invalid+counts.transactionConflicts+counts.transactionDuplicates+counts.budgetConflicts+counts.goalConflicts+counts.goalDuplicates+counts.accountConflicts;
  toast(`Merged ${counts.transactions} transactions, ${counts.budgets} budgets, ${counts.goals} goals and ${counts.accounts} accounts. ${skipped} conflicting, duplicate or invalid records skipped.`);
 }catch(err){console.error(err);toast(err.message||'Restore failed. No import was completed.')}finally{$('#restoreInput').value=''}
}
async function deleteAllData(){const phrase=prompt('This permanently deletes all local transactions, budgets, goals and accounts from this browser. Type DELETE to confirm. Export a backup first.');if(phrase!=='DELETE'){toast('Nothing was deleted.');return}try{await batchWrite(['transactions','budgets','goals','accounts','expenses','settings'],['transactions','budgets','goals','accounts','expenses','settings'].map(store=>({store,action:'clear'})));transactions=[];budgets=[];goals=[];accounts=[];await ensureAccounts();await setSetting('migration-v3-complete',true);renderAll();toast('All local financial data deleted. Default empty accounts were recreated.')}catch(err){console.error(err);toast('Deletion failed. Please retry after exporting a backup.')}}

// Navigation and event wiring
function renderAll(){renderView(selectedView);if(selectedView!=='overview')renderOverview()}
function renderBudgetCategoryOptions(){const current=$('#budgetCategory').value;$('#budgetCategory').innerHTML='<option value="__overall">Overall monthly budget</option>'+EXPENSE_CATEGORIES.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');$('#budgetCategory').value=current||'__overall'}
function setupVisualViewport(){
 const viewport=window.visualViewport;
 const update=()=>{
  const visibleHeight=viewport?viewport.height:window.innerHeight;
  const height=Math.max(240,Math.round(visibleHeight||window.innerHeight));
  document.documentElement.style.setProperty('--voltura-visual-viewport-height',`${height}px`);
  const keyboardOpen=!!viewport&&window.innerHeight-viewport.height>140;
  document.documentElement.classList.toggle('keyboard-visible',keyboardOpen);
 };
 viewport?.addEventListener('resize',update,{passive:true});
 viewport?.addEventListener('scroll',update,{passive:true});
 window.addEventListener('resize',update,{passive:true});
 update();
}
function wireEvents(){
 setupVisualViewport();
 $$('[data-view]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.view)));installDialogAccessibility();$$('[data-go]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.go)));document.addEventListener('click',e=>{const trigger=e.target.closest('[data-open-entry]');if(trigger)openEntry({type:trigger.dataset.openEntry||'expense'})});
 $('#topAddButton').addEventListener('click',()=>openEntry());$('#mobileAddButton').addEventListener('click',()=>openEntry());$('#ledgerAddButton').addEventListener('click',()=>openEntry());$('#topSearchButton').addEventListener('click',()=>{navigate('ledger');$('#ledgerSearch').focus()});$('#addBudgetButton').addEventListener('click',()=>openBudget());$('#quickCreateGoal')?.addEventListener('click',()=>openGoal());$('#addAccountButton').addEventListener('click',()=>openAccount());$('#accountForm').addEventListener('submit',saveAccount);
 $('#quickExpenseForm').addEventListener('submit',saveQuickExpense);$('#undoQuickExpense').addEventListener('click',undoQuickExpense);$('#addAnotherQuickExpense').addEventListener('click',addAnotherQuickExpense);$('#viewDashboardAfterQuickExpense').addEventListener('click',finishQuickExpense);$('#quickExpenseDialog').addEventListener('close',()=>{if(lastQuickSavedId){clearTimeout(quickUndoTimer);quickUndoTimer=0;lastQuickSavedId=''}});$('#quickCategoryChoices').addEventListener('click',event=>{const button=event.target.closest('[data-quick-category]');if(button)setQuickExpenseCategory(button.dataset.quickCategory,true)});$('#quickExpenseMerchant').addEventListener('input',()=>{const guessed=inferCategory($('#quickExpenseMerchant').value,'expense');if(!quickCategoryTouched&&guessed!=='Other'&&$('#quickExpenseMerchant').value.trim())setQuickExpenseCategory(guessed)});$('#quickExpenseAmount').addEventListener('input',()=>{$('#quickExpenseError').hidden=true});
 $('#entryForm').addEventListener('submit',handleEntrySubmit);$('#entryAmount').addEventListener('input',()=>clearFieldError('entryAmount','entryAmountError'));$('#entryDate').addEventListener('change',()=>clearFieldError('entryDate','entryDateError'));$$('.type-tab').forEach(b=>b.addEventListener('click',()=>setEntryType(b.dataset.type)));$('#budgetForm').addEventListener('submit',saveBudget);
 $$('[data-close]').forEach(b=>b.addEventListener('click',()=>$('#'+b.dataset.close).close()));$('#settingsButton').addEventListener('click',()=>showDialog('settingsDialog'));$('#topSettingsButton').addEventListener('click',()=>showDialog('settingsDialog'));
 $('#themePreference').addEventListener('change',event=>saveThemePreference(event.target.value));
 ['ledgerSearch','ledgerTypeFilter','ledgerCategoryFilter','ledgerSort'].forEach(id=>$('#'+id).addEventListener(id==='ledgerSearch'?'input':'change',renderLedger));
 $('#ledgerRows').addEventListener('click',e=>{const edit=e.target.closest('[data-edit]'),delBtn=e.target.closest('[data-delete]');if(edit){const t=transactions.find(x=>x.id===edit.dataset.edit);if(t)openEntry({item:t})}if(delBtn)deleteTransaction(delBtn.dataset.delete)});
 $('#recentTransactions').addEventListener('click',e=>{const edit=e.target.closest('[data-recent-edit]'),remove=e.target.closest('[data-recent-delete]');if(edit){const t=transactions.find(x=>x.id===edit.dataset.recentEdit);if(t)openEntry({item:t})}if(remove)deleteTransaction(remove.dataset.recentDelete)});
 $('#accountsGrid').addEventListener('click',e=>{const edit=e.target.closest('[data-edit-account]'),remove=e.target.closest('[data-delete-account]');if(edit){const a=accounts.find(x=>x.name===edit.dataset.editAccount);if(a)openAccount(a)}if(remove)deleteAccount(remove.dataset.deleteAccount)});
 $('#budgetCards').addEventListener('click',e=>{const edit=e.target.closest('[data-edit-budget]'),remove=e.target.closest('[data-delete-budget]');if(edit)openBudget(budgets.find(b=>b.id===edit.dataset.editBudget));if(remove)deleteBudget(remove.dataset.deleteBudget)});
 
 $('#exportCsvButton').addEventListener('click',exportCSV);$('#backupButton').addEventListener('click',backupJSON);$('#restoreButton').addEventListener('click',()=>$('#restoreInput').click());$('#restoreInput').addEventListener('change',e=>restoreJSON(e.target.files?.[0]));$('#deleteAllButton').addEventListener('click',deleteAllData);
 
 
 
 
}

function showUpdateNotice(message,mode='activate'){const notice=$('#appUpdateNotice'),copy=$('#appUpdateMessage'),button=$('#applyAppUpdate');if(!notice||!copy||!button)return;copy.textContent=message;button.dataset.mode=mode;button.textContent=mode==='reload'?'Reload VOLTURA':'Update now';button.disabled=false;notice.hidden=false}
function applyAvailableUpdate(){const button=$('#applyAppUpdate'),message=$('#appUpdateMessage');if(entrySaving||quickExpenseSaving||document.querySelector('dialog[open]')){toast('Finish or close the open form before applying the update. Your saved data is safe.');return}if(button.dataset.mode==='reload'){location.reload();return}const worker=waitingServiceWorker||serviceWorkerRegistration?.waiting;if(!worker){$('#appUpdateNotice').hidden=true;toast('No waiting update is available.');return}updateActivationRequested=true;button.disabled=true;button.textContent='Updating…';message.textContent='Applying the update. Your saved transactions stay on this device.';worker.postMessage({type:'SKIP_WAITING'});setTimeout(()=>{if(!updateActivationRequested)return;updateActivationRequested=false;button.disabled=false;button.textContent='Update now';message.textContent='The update is still waiting. You can keep using VOLTURA and try again.'},12000)}
function registerServiceWorker(){if(!('serviceWorker'in navigator)||!location.protocol.startsWith('http'))return;serviceWorkerHadController=!!navigator.serviceWorker.controller;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!serviceWorkerHadController){serviceWorkerHadController=true;return}waitingServiceWorker=null;if(updateActivationRequested){location.reload();return}showUpdateNotice('The update is active. Reload VOLTURA when convenient.','reload')});$('#applyAppUpdate').addEventListener('click',applyAvailableUpdate);$('#dismissAppUpdate').addEventListener('click',()=>{$('#appUpdateNotice').hidden=true});navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(registration=>{serviceWorkerRegistration=registration;registration.update().catch(err=>console.warn('Update check:',err));if(registration.waiting&&registration.active){waitingServiceWorker=registration.waiting;showUpdateNotice('A VOLTURA update is ready. You can keep working or apply it now.')}registration.addEventListener('updatefound',()=>{const worker=registration.installing;if(!worker)return;worker.addEventListener('statechange',()=>{if(worker.state==='installed'&&registration.active&&registration.waiting){waitingServiceWorker=registration.waiting;showUpdateNotice('A VOLTURA update is ready. You can keep working or apply it now.')}})})}).catch(err=>console.warn('Service worker:',err))}
async function init(){try{db=await openDB();await migrateLegacy();await loadAll();await ensureAccounts();await loadUserPreferences();renderBudgetCategoryOptions();populateAccountSelects();wireEvents();renderAll();applyUrlAction();registerServiceWorker();document.documentElement.classList.remove('nfc-launch')}catch(err){console.error(err);document.documentElement.classList.remove('nfc-launch');for(const id of ['quickExpenseDialog','entryDialog']){const dialog=document.getElementById(id);if(dialog?.open)dialog.close()}toast('VOLTURA could not open local storage. Your existing browser data has not been intentionally changed. Try again in a supported browser or export a backup from a working installation.')}}


init();



