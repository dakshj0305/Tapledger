/* VOLTURA scroll chapters — native ScrollTrigger-inspired behavior.
   Keeps native scrolling intact; GSAP can progressively enhance when locally bundled. */
(()=>{
 'use strict';
 const nav=document.querySelector('.scroll-chapter-nav');
 const view=document.querySelector('#view-overview');
 if(!nav||!view)return;
 const links=[...nav.querySelectorAll('[data-chapter]')];
 const chapters=links.map(link=>document.getElementById(link.getAttribute('href').slice(1))).filter(Boolean);
 const fill=nav.querySelector('.scroll-chapter-progress i');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let active=-1,raf=0;
 const setActive=(index)=>{
  if(index<0||index>=chapters.length||index===active)return;
  active=index;
  links.forEach((link,i)=>{
   const on=i===index;link.classList.toggle('active',on);
   if(on)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
  });
  chapters.forEach((el,i)=>el.classList.toggle('chapter-current',i===index));
  const target=chapters[index];
  if(!reduced&&target){
   target.classList.remove('overview-view-transition');
   requestAnimationFrame(()=>target.classList.add('overview-view-transition'));
  }
 };
 const observer=('IntersectionObserver'in window)?new IntersectionObserver(entries=>{
  const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
  if(visible[0])setActive(chapters.indexOf(visible[0].target));
 },{root:null,rootMargin:'-22% 0px -58% 0px',threshold:[0,.15,.35,.6]}):null;
 if(observer)chapters.forEach(el=>observer.observe(el));
 links.forEach(link=>link.addEventListener('click',e=>{
  const target=document.querySelector(link.getAttribute('href'));
  if(!target)return;
  e.preventDefault();
  target.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
  setActive(Number(link.dataset.chapter));
 }));
 const update=()=>{
  raf=0;
  if(!view.classList.contains('active')){nav.hidden=true;return}
  nav.hidden=false;
  const rect=view.getBoundingClientRect();
  const start=rect.top+scrollY;
  const total=Math.max(1,view.scrollHeight-innerHeight);
  const progress=Math.min(1,Math.max(0,(scrollY-start)/total));
  nav.style.setProperty('--chapter-scroll-progress',progress);
  if(fill){fill.style.width=`${progress*100}%`;fill.style.opacity='.95';}
 };
 const fallbackActive=()=>{if(observer||!view.classList.contains('active'))return;const pivot=innerHeight*.42;let best=0,distance=Infinity;chapters.forEach((el,i)=>{const d=Math.abs(el.getBoundingClientRect().top-pivot);if(d<distance){distance=d;best=i}});setActive(best)};
 const schedule=()=>{if(!raf)raf=requestAnimationFrame(()=>{update();fallbackActive()})};
 addEventListener('scroll',schedule,{passive:true});
 addEventListener('resize',schedule,{passive:true});
 // The app swaps views without full page navigation; observe those state changes.
 if('MutationObserver'in window)new MutationObserver(schedule).observe(view,{attributes:true,attributeFilter:['class']});
 schedule();
 // Optional local GSAP enhancement. No remote script or runtime dependency is added.
 if(window.gsap&&window.ScrollTrigger){
  window.gsap.registerPlugin(window.ScrollTrigger);
  chapters.forEach((el)=>{
   window.gsap.fromTo(el,{y:18,opacity:.72},{y:0,opacity:1,duration:.65,ease:'power3.out',
    scrollTrigger:{trigger:el,start:'top 82%',once:true}});
  });
 }
})();