"use strict";
/* coi-service-worker : injecte COOP/COEP (crossOriginIsolated) pour SharedArrayBuffer/pthreads.
   Play! (PS2) est un build threadé -> ces en-têtes sont OBLIGATOIRES. En file:// c'est impossible :
   la page doit être servie (localhost, Netlify, Cloudflare Pages…). */
const CACHE = 'ps2-coi-v1';
function coi(resp, url){
  if(!resp || resp.type === 'opaque' || resp.type === 'opaqueredirect') return resp;
  try{
    const h = new Headers(resp.headers);
    h.set('Cross-Origin-Embedder-Policy', 'require-corp');
    h.set('Cross-Origin-Opener-Policy', 'same-origin');
    h.set('Cross-Origin-Resource-Policy', 'same-origin');
    // corrige le MIME du wasm (Cloudflare workers.dev sert parfois octet-stream/text)
    if(url && /\.wasm(\?|$)/.test(url)) h.set('Content-Type', 'application/wasm');
    return new Response(resp.body, { status: resp.status, statusText: resp.statusText, headers: h });
  }catch(e){ return resp; }
}
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil((async () => {
  try{ const ks = await caches.keys(); await Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))); }catch(e){}
  await self.clients.claim();
})()));
self.addEventListener('fetch', event => {
  const req = event.request; if(req.method !== 'GET') return;
  let url; try{ url = new URL(req.url); }catch(e){ return; }
  if(url.origin !== self.location.origin) return;
  if(url.protocol !== 'https:' && url.protocol !== 'http:') return;
  event.respondWith((async () => {
    try{
      const cache = await caches.open(CACHE);
      if(req.mode === 'navigate'){
        try{ const net = await fetch(req); if(net && net.ok && net.type === 'basic') await cache.put(req, net.clone()); return coi(net, req.url); }
        catch(e){ const c = await cache.match(req); if(c) return coi(c, req.url); throw e; }
      }
      const hit = await cache.match(req);
      if(hit){ event.waitUntil((async () => { try{ const f = await fetch(req); if(f && f.ok && f.type === 'basic') await cache.put(req, f.clone()); }catch(e){} })()); return coi(hit, req.url); }
      const r = await fetch(req);
      try{ if(r && r.ok && r.status === 200 && r.type === 'basic') await cache.put(req, r.clone()); }catch(e){}
      return coi(r, req.url);
    }catch(e){ try{ return coi(await fetch(req), req.url); }catch(e2){ return fetch(req); } }
  })());
});
