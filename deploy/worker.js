/*
 * Worker qui sert le lecteur PS2 (Play!) en ajoutant, sur CHAQUE réponse, les en-têtes
 * obligatoires pour un build threadé :
 *   - Cross-Origin-Opener-Policy: same-origin      ┐ => crossOriginIsolated = true
 *   - Cross-Origin-Embedder-Policy: require-corp    ┘    (SharedArrayBuffer / pthreads), aussi en PWA
 *   - Cross-Origin-Resource-Policy: same-origin     => le worker peut charger wasm/js sous COEP
 *   - Content-Type: application/wasm sur les .wasm  => corrige "Unexpected response MIME type"
 */
export default {
  async fetch(request, env) {
    const res = await env.ASSETS.fetch(request);
    const h = new Headers(res.headers);
    h.set("Cross-Origin-Opener-Policy", "same-origin");
    h.set("Cross-Origin-Embedder-Policy", "require-corp");
    h.set("Cross-Origin-Resource-Policy", "same-origin");
    if (new URL(request.url).pathname.endsWith(".wasm")) {
      h.set("Content-Type", "application/wasm");
    }
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
  },
};
