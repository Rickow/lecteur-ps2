/*
 * Cloudflare Worker (domaine *.workers.dev) qui sert le lecteur PS2 avec les
 * en-têtes OBLIGATOIRES pour Play! (build threadé) :
 *   - COOP/COEP  -> crossOriginIsolated (SharedArrayBuffer / pthreads), aussi en PWA
 *   - CORP       -> autorise le worker à charger le wasm/js sous COEP require-corp
 *   - Content-Type: application/wasm pour les .wasm
 *
 * Suppose un binding "ASSETS" pointant vers les fichiers statiques
 * (lecteur-ps2.html, Play.js, Play.wasm, coi-sw.js, index.html…).
 * wrangler.toml :
 *   name = "lecteur-ps2"
 *   main = "cloudflare-worker.js"
 *   compatibility_date = "2024-01-01"
 *   [assets]
 *   directory = "./"
 *   binding = "ASSETS"
 *
 * Si tu utilises Cloudflare *Pages* (et non un Worker), IGNORE ce fichier :
 * le fichier `_headers` suffit.
 */
export default {
  async fetch(request, env) {
    const res = await env.ASSETS.fetch(request);
    const h = new Headers(res.headers);
    h.set('Cross-Origin-Opener-Policy', 'same-origin');
    h.set('Cross-Origin-Embedder-Policy', 'require-corp');
    h.set('Cross-Origin-Resource-Policy', 'same-origin');
    if (new URL(request.url).pathname.endsWith('.wasm')) {
      h.set('Content-Type', 'application/wasm');
    }
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
  }
};
