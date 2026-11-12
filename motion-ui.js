/* VOLTURA motion system — local-first progressive enhancement.
   Native motion is the offline-safe default; no remote animation runtime is loaded. */
(()=>{
 'use strict';
 const root=document.documentElement, body=document.body;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
 const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
 const progress=document.createElement('div');progress.className='motion-progress';progress.setAttribute('aria-hidden','true');progress.innerHTML='<span></span>';
 body.append(progress);
 const bar=progress.firstElementChild;let scrollRaf=0;
 function paintScroll(){const max=document.documentElement.scrollHeight-innerHeight;bar.style.transform=`scaleX(${max>0?clamp(scrollY/max,0,1):0})`;scrollRaf=0}
 addEventListener('scroll',()=>{if(!scrollRaf)scrollRaf=requestAnimationFrame(paintScroll)},{passive:true});addEventListener('resize',paintScroll,{passive:true});paintScroll();
 // Fine-pointer 3D tilt and magnetic buttons. Touch users get no fake cursor.
 if(fine&&!reduce){document.querySelectorAll('.balance-hero,.insight-feature').forEach(card=>{card.classList.add('motion-tilt');card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;card.style.setProperty('--tilt-x',`${(0.5-y)*5}deg`);card.style.setProperty('--tilt-y',`${(x-0.5)*7}deg`)},{passive:true});card.addEventListener('pointerleave',()=>{card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg')},{passive:true})});
  document.querySelectorAll('.button-primary,.icon-button').forEach(el=>{el.classList.add('motion-magnetic');el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--mag-x',`${(e.clientX-r.left-r.width/2)*.08}px`);el.style.setProperty('--mag-y',`${(e.clientY-r.top-r.height/2)*.12}px`)},{passive:true});el.addEventListener('pointerleave',()=>{el.style.setProperty('--mag-x','0px');el.style.setProperty('--mag-y','0px')},{passive:true})});
 }
 // Trackpad / wheel sensing: direction and energy are reflected in the interface;
 // native scrolling is never prevented or remapped.
 let wheelRaf=0,wx=0,wy=0,wheelReset=0;addEventListener('wheel',e=>{if(reduce)return;wx=e.deltaX;wy=e.deltaY;if(!wheelRaf)wheelRaf=requestAnimationFrame(()=>{root.style.setProperty('--gesture-x',`${clamp(wx/90,-1.8,1.8)}deg`);root.style.setProperty('--gesture-y',`${clamp(wy/180,-1.2,1.2)}deg`);wheelRaf=0});clearTimeout(wheelReset);wheelReset=setTimeout(()=>{root.style.setProperty('--gesture-x','0deg');root.style.setProperty('--gesture-y','0deg')},180)},{passive:true});
 // Reveal newly-mounted views, including views rendered by the app after boot.
 const selector='.page-intro,.balance-hero,.stat-card,.chart-card,.panel,.ledger-card,.budget-card,.goal-card,.settings-card,.insight-feature,.cashflow-panel';
 const seen=new WeakSet();function reveal(scope=document){const nodes=[];if(scope.matches?.(selector))nodes.push(scope);nodes.push(...(scope.querySelectorAll?.(selector)||[]));nodes.forEach((el,i)=>{if(seen.has(el))return;seen.add(el);el.classList.add('motion-reveal');el.style.setProperty('--reveal-delay',`${Math.min(i%5,4)*65}ms`);if(reduce||!observer){el.classList.add('is-visible');return}observer.observe(el)})}
 const observer=('IntersectionObserver'in window)?new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.07,rootMargin:'0px 0px -28px 0px'}):null;
 const main=document.querySelector('#main-content')||body;reveal(main);if('MutationObserver'in window)new MutationObserver(records=>records.forEach(rec=>rec.addedNodes.forEach(n=>{if(n.nodeType===1)reveal(n)}))).observe(main,{subtree:true,childList:true});
 // Intentional view transition without delaying navigation or breaking keyboard use.
 document.addEventListener('click',e=>{const trigger=e.target.closest('[data-view],.nav-item');if(!trigger)return;requestAnimationFrame(()=>{const active=document.querySelector('.view.active');if(active&&!reduce){active.classList.remove('view-enter');void active.offsetWidth;active.classList.add('view-enter')}reveal(main)})},{passive:true});
})();
