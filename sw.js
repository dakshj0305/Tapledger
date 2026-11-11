const CACHE='voltura-preview-v2';
const FILES=['./','index.html','style.css','app.js','manifest.webmanifest','icon.svg','privacy.html','terms.html'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n.startsWith('voltura-preview-')&&n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
e.respondWith(caches.match(r,{ignoreSearch:true}).then(c=>c||fetch(r).then(x=>{if(x.ok){const y=x.clone();caches.open(CACHE).then(k=>k.put(r,y))}return x}).catch(()=>caches.match('index.html'))))});
