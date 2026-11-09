const CACHE='voltura-platform-v16';
const APP_FILES=['','index.html','style.css','app.js','manifest.webmanifest','privacy.html','terms.html','cookies.html','legal.css','icons/icon-192.png','icons/icon-512.png','icons/icon-192-maskable.png','icons/icon-512-maskable.png','icons/voltura-mark.svg'];
const appURL=file=>new URL(file||'./',self.registration.scope).href;
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP_FILES.map(appURL))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>(key.startsWith('vellum-platform-')||key.startsWith('voltura-platform-'))&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  const scope=new URL(self.registration.scope);
  if(!url.pathname.startsWith(scope.pathname))return;
  const relative=url.pathname.slice(scope.pathname.length);
  const known=APP_FILES.includes(relative)||relative===''&&request.mode==='navigate';
  if(!known)return;
  const cacheKey=appURL(relative);
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(response=>{
      if(response.ok)caches.open(CACHE).then(cache=>cache.put(cacheKey,response.clone()));
      return response;
    }).catch(async()=>{
      const cached=await caches.match(cacheKey);
      if(cached)return cached;
      return caches.match(appURL('index.html'));
    }));
  }else{
    event.respondWith(caches.match(cacheKey).then(cached=>cached||fetch(request).then(response=>{
      if(response.ok)caches.open(CACHE).then(cache=>cache.put(cacheKey,response.clone()));
      return response;
    })));
  }
});
