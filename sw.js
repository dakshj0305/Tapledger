const CACHE='voltura-platform-v26.0.2';
const APP_FILES=['','index.html','voltura.css','kinetic.js','dashboard-art-direction.css','motion-ui.js','scroll-story.js','liquid-metal.js','finance-core.js','app.js','quick-boot.js','manifest.webmanifest','privacy.html','terms.html','cookies.html','legal.css','icons/icon-192.png','icons/icon-512.png','icons/icon-192-maskable.png','icons/icon-512-maskable.png','icons/voltura-mark.svg'];
const appURL=file=>new URL(file||'./',self.registration.scope).href;
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP_FILES.map(appURL)))));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')event.waitUntil(self.skipWaiting())});
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>/^(vellum-platform-|voltura-platform-)/.test(key)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const request=event.request;if(request.method!=='GET')return;
 const url=new URL(request.url);if(url.origin!==self.location.origin)return;
 const scope=new URL(self.registration.scope);if(!url.pathname.startsWith(scope.pathname))return;
 const relative=url.pathname.slice(scope.pathname.length);const known=APP_FILES.includes(relative)||relative===''&&request.mode==='navigate';if(!known)return;
 const cacheKey=appURL(relative);
 let cacheWrite=Promise.resolve();
 if(request.mode==='navigate'){
  const responsePromise=fetch(request).then(response=>{
   if(response.ok)cacheWrite=caches.open(CACHE).then(cache=>cache.put(cacheKey,response.clone())).catch(()=>{});
   return response;
  }).catch(async()=>{
   const cached=await caches.match(cacheKey);if(cached)return cached;
   const shell=await caches.match(appURL('index.html'));if(shell)return shell;
   return new Response('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>VOLTURA offline</title><body><h1>VOLTURA is not cached yet</h1><p>Connect to the internet and open VOLTURA once. After the first successful cache install, this app shell can be available offline.</p></body></html>',{headers:{'Content-Type':'text/html; charset=utf-8'}});
  });
  event.respondWith(responsePromise);
  event.waitUntil(responsePromise.then(()=>cacheWrite,()=>undefined));
 }else{
  const responsePromise=caches.match(cacheKey).then(cached=>{
   if(cached)return cached;
   return fetch(request).then(response=>{
    if(response.ok)cacheWrite=caches.open(CACHE).then(cache=>cache.put(cacheKey,response.clone())).catch(()=>{});
    return response;
   });
  });
  event.respondWith(responsePromise);
  event.waitUntil(responsePromise.then(()=>cacheWrite,()=>undefined));
 }
});
