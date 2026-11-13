/* VOLTURA cinematic motion layer. No remote runtime dependencies. */
(()=>{'use strict';
 const track=document.querySelector('.cinematic-flow-track');
 if(!track)return;
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 if(reduce.matches)return;
 let raf=0;
 const update=()=>{raf=0;const section=track.closest('.cinematic-flow');if(!section)return;const rect=section.getBoundingClientRect();const range=window.innerHeight+rect.height;const progress=Math.max(0,Math.min(1,(window.innerHeight-rect.top)/range));const travel=Math.max(0,track.scrollWidth-window.innerWidth+40);track.style.transform=`translate3d(${-travel*progress}px,0,0)`;};
 const onScroll=()=>{if(!raf)raf=requestAnimationFrame(update)};
 window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll,{passive:true});update();
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&raf){cancelAnimationFrame(raf);raf=0}else onScroll()});
})();
