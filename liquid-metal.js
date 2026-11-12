/* Liquid-metal button interaction: local, dependency-free progressive enhancement. */
(()=>{
  'use strict';
  const selector='.button-primary,.button-light,.icon-button';
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.addEventListener('pointermove',event=>{
    const button=event.target.closest(selector);
    if(!button || event.pointerType==='touch') return;
    const rect=button.getBoundingClientRect();
    button.style.setProperty('--liquid-x',`${event.clientX-rect.left}px`);
    button.style.setProperty('--liquid-y',`${event.clientY-rect.top}px`);
  },{passive:true});
  document.addEventListener('pointerleave',event=>{
    const button=event.target.closest?.(selector);
    if(button){button.style.setProperty('--liquid-x','50%');button.style.setProperty('--liquid-y','50%');}
  },true);
  document.addEventListener('click',event=>{
    const button=event.target.closest(selector);
    if(!button || reduced) return;
    const rect=button.getBoundingClientRect();
    const ripple=document.createElement('span');
    ripple.className='liquid-ripple';
    ripple.setAttribute('aria-hidden','true');
    ripple.style.left=`${event.clientX ? event.clientX-rect.left : rect.width/2}px`;
    ripple.style.top=`${event.clientY ? event.clientY-rect.top : rect.height/2}px`;
    button.append(ripple);
    ripple.addEventListener('animationend',()=>ripple.remove(),{once:true});
  });
})();
