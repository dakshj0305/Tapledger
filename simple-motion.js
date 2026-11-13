/* VOLTURA GSAP motion — restrained, optional and safe to skip.
   Core navigation, storage, forms and finance calculations never depend on this file. */
(()=>{
 'use strict';
 const gsap=window.gsap,ScrollTrigger=window.ScrollTrigger;
 if(!gsap||!ScrollTrigger||typeof gsap.matchMedia!=='function')return;
 try{gsap.registerPlugin(ScrollTrigger)}catch(_){return}
 const media=gsap.matchMedia();
 media.add('(prefers-reduced-motion: no-preference)',()=>{
  const triggers=[];
  let activeView=document.querySelector('.view.active');
  let navFrame=0;
  const intro=gsap.timeline({defaults:{ease:'power2.out'}});
  intro.fromTo('.dashboard-masthead .masthead-copy',{y:10,autoAlpha:0},{y:0,autoAlpha:1,duration:.38,clearProps:'transform,opacity,visibility'})
   .fromTo('.masthead-index',{y:8,autoAlpha:0},{y:0,autoAlpha:1,duration:.3,clearProps:'transform,opacity,visibility'},'-=.24')
   .fromTo('.balance-main',{y:10,autoAlpha:0},{y:0,autoAlpha:1,duration:.38,clearProps:'transform,opacity,visibility'},'-=.16')
   .fromTo('.balance-stat',{y:8,autoAlpha:0},{y:0,autoAlpha:1,duration:.32,stagger:.055,clearProps:'transform,opacity,visibility'},'-=.22');
  document.querySelectorAll('[data-reveal]:not(.balance-hero)').forEach(el=>{
   const tween=gsap.fromTo(el,{y:9,autoAlpha:0},{y:0,autoAlpha:1,duration:.36,ease:'power2.out',clearProps:'transform,opacity,visibility',scrollTrigger:{trigger:el,start:'top 94%',once:true,fastScrollEnd:true}});
   if(tween.scrollTrigger)triggers.push(tween.scrollTrigger);
  });
  const viewObserver=new MutationObserver(()=>{
   if(navFrame)return;
   navFrame=requestAnimationFrame(()=>{
    navFrame=0;
    const next=document.querySelector('.view.active');
    if(!next||next===activeView)return;
    activeView=next;
    const targets=[...next.querySelectorAll('.page-headline,.ledger-summary,.ledger-panel,.account-card,.budget-card')].slice(0,12);
    if(targets.length)gsap.fromTo(targets,{y:8,autoAlpha:0},{y:0,autoAlpha:1,duration:.3,stagger:.035,ease:'power2.out',clearProps:'transform,opacity,visibility',overwrite:true});
    ScrollTrigger.refresh();
   });
  });
  document.querySelectorAll('.view').forEach(el=>viewObserver.observe(el,{attributes:true,attributeFilter:['class']}));
  const progress=document.getElementById('budgetProgressFill');
  const animateProgress=()=>{if(progress?.style.width)gsap.fromTo(progress,{scaleX:0},{scaleX:1,duration:.52,ease:'power2.out',transformOrigin:'left center',overwrite:true})};
  const progressObserver=progress?new MutationObserver(records=>{if(records.some(record=>record.attributeName==='style'))animateProgress()}):null;
  progressObserver?.observe(progress,{attributes:true,attributeFilter:['style']});
  if(progress?.style.width)animateProgress();
  return()=>{
   intro.kill();
   triggers.forEach(trigger=>trigger.kill());
   viewObserver.disconnect();
   progressObserver?.disconnect();
   if(navFrame)cancelAnimationFrame(navFrame);
  };
 });
})();
