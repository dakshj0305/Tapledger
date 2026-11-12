/* VOLTURA V23 vivid depth interactions — no WebGL, no remote dependencies. */
(()=>{'use strict';
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
 if(reduce||!fine)return;
 const selector='.account-card,.budget-card,.goal-card,.insight-card,.summary-tile,.stat-card,.chart-card,.balance-hero,.insight-feature';
 let frame=0,last=null;
 document.addEventListener('pointermove',e=>{
  const card=e.target.closest(selector);if(!card)return;
  last={card,x:e.clientX,y:e.clientY};
  if(frame)return;
  frame=requestAnimationFrame(()=>{
   if(!last){frame=0;return}
   const {card,x,y}=last,r=card.getBoundingClientRect();
   const px=Math.max(0,Math.min(1,(x-r.left)/r.width)),py=Math.max(0,Math.min(1,(y-r.top)/r.height));
   const strength=card.matches('.balance-hero,.insight-feature')?5:2.4;
   card.style.setProperty('--card-rx',`${(0.5-py)*strength}deg`);
   card.style.setProperty('--card-ry',`${(px-0.5)*strength}deg`);
   card.style.setProperty('--shine-x',`${px*100}%`);card.style.setProperty('--shine-y',`${py*100}%`);
   frame=0;
  });
 },{passive:true});
 document.addEventListener('pointerout',e=>{
  const card=e.target.closest?.(selector);if(!card||card.contains(e.relatedTarget))return;
  card.style.setProperty('--card-rx','0deg');card.style.setProperty('--card-ry','0deg');
 },{passive:true});
 // Give newly rendered cards a subtle depth baseline without hiding content.
 const mark=scope=>{if(scope.matches?.(selector))scope.classList.add('vivid-depth');scope.querySelectorAll?.(selector).forEach(el=>el.classList.add('vivid-depth'))};
 mark(document);
 const main=document.querySelector('#main-content');
 if(main&&'MutationObserver'in window)new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType===1)mark(n)}))).observe(main,{childList:true,subtree:true});
})();