/* VOLTURA Atelier motion layer.
   Decorative CSS 3D + Canvas 2D only. No WebGL, network calls, or finance-data access. */
(()=>{
 'use strict';
 const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;
 const finePointer=window.matchMedia?.('(hover:hover) and (pointer:fine)').matches??false;
 const $=(selector,root=document)=>root.querySelector(selector);
 const masthead=$('.dashboard-masthead');

 // Dimensional orbital object: decorative and hidden from assistive technology.
 if(masthead&&!masthead.querySelector('.kinetic-stage')){
  const stage=document.createElement('div');
  stage.className='kinetic-stage';
  stage.setAttribute('aria-hidden','true');
  stage.innerHTML='<div class="kinetic-relic"><i class="relic-ring"></i><i class="relic-ring ring-two"></i><i class="relic-ring ring-three"></i><i class="relic-core"></i></div><span class="relic-label">CAPITAL / FIELD 001</span>';
  masthead.append(stage);
  for(let i=0;i<9;i++){
   const spark=document.createElement('i');
   spark.className='kinetic-spark';
   spark.style.left=(10+(i*37)%82)+'%';
   spark.style.top=(12+(i*53)%72)+'%';
   spark.style.animationDelay=(-i*.43)+'s';
   masthead.append(spark);
  }
  if(!reduce&&finePointer){
   const relic=$('.kinetic-relic',stage);let targetX=0,targetY=0,currentX=0,currentY=0,raf=0;
   const tick=()=>{
    currentX+=(targetX-currentX)*.075;currentY+=(targetY-currentY)*.075;
    relic.style.transform=`translate3d(${currentX*.28}px,${currentY*.28}px,28px) rotateX(${currentY}deg) rotateY(${currentX}deg)`;
    raf=0;
    if(Math.abs(targetX-currentX)+Math.abs(targetY-currentY)>.04)raf=requestAnimationFrame(tick);
   };
   stage.addEventListener('pointermove',event=>{
    const rect=stage.getBoundingClientRect();if(!rect.width||!rect.height)return;
    targetX=((event.clientX-rect.left)/rect.width-.5)*12;
    targetY=((event.clientY-rect.top)/rect.height-.5)*-12;
    if(!raf)raf=requestAnimationFrame(tick);
   },{passive:true});
   stage.addEventListener('pointerleave',()=>{targetX=0;targetY=0;if(!raf)raf=requestAnimationFrame(tick)},{passive:true});
  }
 }

 // Canvas is optional. A missing/blocked 2D context must not abort other UI motion.
 const hero=$('.balance-hero');
 if(hero&&!hero.querySelector('.kinetic-canvas')){
  const canvas=document.createElement('canvas');canvas.className='kinetic-canvas';canvas.setAttribute('aria-hidden','true');hero.prepend(canvas);
  let ctx=null;
  try{ctx=canvas.getContext?.('2d',{alpha:true})??null}catch(_){ctx=null}
  if(ctx){
   let width=0,height=0,dpr=1,phase=0,raf=0;
   const points=Array.from({length:128},()=>({a:Math.random()*Math.PI*2,b:Math.acos(2*Math.random()-1),s:.4+Math.random()*1.2}));
   const resize=()=>{
    const rect=hero.getBoundingClientRect();width=Math.max(1,rect.width);height=Math.max(1,rect.height);
    dpr=Math.min(window.devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    canvas.style.width=width+'px';canvas.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
   };
   const draw=animate=>{
    raf=0;ctx.clearRect(0,0,width,height);if(animate)phase+=.003;
    const cx=width*.79,cy=height*.5,radius=Math.min(width,height)*.34;
    const projected=points.map(point=>{
     const angle=point.a+phase*.18,x=Math.sin(point.b)*Math.cos(angle),y=Math.cos(point.b),z=Math.sin(point.b)*Math.sin(angle);
     const depth=2.8/(2.8-z*.48);return{x:cx+x*radius*depth,y:cy+y*radius*depth,z,size:point.s*depth};
    }).sort((a,b)=>a.z-b.z);
    for(const point of projected){
     const alpha=.10+(point.z+1)*.20;ctx.beginPath();
     ctx.fillStyle=point.z>.4?`rgba(224,201,155,${alpha})`:`rgba(185,154,100,${alpha})`;
     ctx.arc(point.x,point.y,point.size,0,Math.PI*2);ctx.fill();
    }
    for(let ring=0;ring<2;ring++){
     ctx.beginPath();ctx.ellipse(cx,cy,radius*(1+ring*.17),radius*(.22+ring*.055),-.35+ring*.45,0,Math.PI*2);
     ctx.strokeStyle=ring?'rgba(255,255,255,.07)':'rgba(224,201,155,.20)';ctx.lineWidth=1;ctx.stroke();
    }
    if(animate&&!reduce)raf=requestAnimationFrame(()=>draw(true));
   };
   resize();draw(!reduce);
   if('ResizeObserver'in window){const observer=new ResizeObserver(()=>{resize();if(!raf)raf=requestAnimationFrame(()=>draw(!reduce))});observer.observe(hero)}
   else window.addEventListener('resize',()=>{resize();if(!raf)raf=requestAnimationFrame(()=>draw(!reduce))},{passive:true});
   document.addEventListener('visibilitychange',()=>{
    if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0}
    else if(!raf&&!reduce)raf=requestAnimationFrame(()=>draw(true));
   });
  }else canvas.remove();
 }

 // View transitions remain independent of Canvas and are skipped for reduced motion.
 if('MutationObserver'in window){
  const views=[...document.querySelectorAll('.view')];
  const observer=new MutationObserver(()=>{
   const active=views.find(view=>view.classList.contains('active'));
   if(active&&!reduce&&typeof active.animate==='function')active.animate(
    [{opacity:.78,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],
    {duration:420,easing:'cubic-bezier(.2,.75,.2,1)'}
   );
  });
  views.forEach(view=>observer.observe(view,{attributes:true,attributeFilter:['class']}));
 }
})();
