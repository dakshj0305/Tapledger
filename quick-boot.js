/* Early NFC/URL shortcut capture. Runs in <head> before styles and app boot. */
(()=>{
 'use strict';
 const params=new URLSearchParams(location.search);
 const type=params.get('a')==='1'||params.get('add')==='1'?'expense':params.get('i')==='1'?'income':'';
 if(!type)return;
 window.__volturaLaunchIntent=Object.freeze({type,source:'nfc'});
 document.documentElement.classList.add('nfc-launch');
 const openEarly=()=>{
  if(document.readyState!=='interactive'&&document.readyState!=='complete')return;
  const id=type==='expense'?'quickExpenseDialog':'entryDialog';
  const dialog=document.getElementById(id);if(!dialog||dialog.open)return;
  if(type==='expense'){
   const save=document.getElementById('quickExpenseSave');if(save)save.disabled=true;
   const feedback=document.getElementById('quickFeedback');if(feedback)feedback.textContent='';
   const fields=document.getElementById('quickExpenseFields');if(fields)fields.hidden=true;
   const loading=document.getElementById('quickExpenseLoading');if(loading)loading.hidden=false;
  }else{
   const form=document.getElementById('entryForm');if(form)form.classList.add('is-launch-loading');
   const submit=document.querySelector('#entryForm button[type="submit"]');if(submit)submit.disabled=true;
   const title=document.getElementById('entryDialogTitle');if(title)title.textContent='Record income';
   const type=document.getElementById('entryType');if(type)type.value='income';
   document.querySelectorAll('.type-tab').forEach(tab=>{const active=tab.dataset.type==='income';tab.classList.toggle('active',active)});
   const loading=document.getElementById('entryLaunchLoading');if(loading)loading.hidden=false;
  }
  try{dialog.showModal()}catch(error){console.error('Could not open the quick-entry surface:',error);document.documentElement.classList.remove('nfc-launch')}
 };
 if(document.readyState==='interactive'||document.readyState==='complete')openEarly();
 else document.addEventListener('readystatechange',openEarly);
})();
