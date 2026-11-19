// 새떼 주의보: 짹짹 디펜스 서비스 워커: 네트워크 우선(항상 최신 버전), 인터넷이 끊기면 마지막으로 받은 파일로 실행
const CACHE='jjak-v1';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 const ok=u.origin===location.origin||/cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com/.test(u.host);if(!ok)return;
 e.respondWith(fetch(r).then(res=>{if(res&&res.status===200){const c=res.clone();caches.open(CACHE).then(ca=>ca.put(r,c))}return res}).catch(()=>caches.match(r,{ignoreSearch:u.origin===location.origin})))});
