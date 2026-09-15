# Déploiement — Lecteur PS2 sur Cloudflare Workers

Package prêt pour un **Cloudflare Worker avec assets statiques**. Le Worker ajoute les
en-têtes **COOP/COEP/CORP** (indispensables aux threads de Play!) + le bon MIME `.wasm`.

## Contenu

```
wrangler.toml        config (assets ./public + run_worker_first)
worker.js            ajoute les en-têtes sur chaque réponse
public/              les fichiers servis
  lecteur-ps2.html   l'app
  index.html         copie (racine)
  Play.js Play.wasm  build officiel de Play! (BSD — voir PLAY-LICENSE.txt)
  coi-sw.js          service worker de secours (facultatif)
  _headers           en-têtes (secours / si tu passes en Cloudflare Pages)
  PLAY-LICENSE.txt   licence de Play!
```

## Déployer

```bash
# 1) une seule fois : installer wrangler (ou utiliser npx)
npm install -g wrangler
wrangler login

# 2) depuis ce dossier
wrangler deploy
```

L'URL `https://lecteur-ps2.<ton-sous-domaine>.workers.dev` s'affiche à la fin.

## Vérifier (sur iPhone / navigateur)

- Ouvre l'URL → l'écran doit passer à **« Charger un jeu »** (pas « Initialisation… »).
- Console : `crossOriginIsolated` doit valoir **`true`**.
- En-têtes de `Play.wasm` : `content-type: application/wasm` +
  `cross-origin-resource-policy: same-origin`.

Si `crossOriginIsolated` est `false` : `run_worker_first` n'est pas actif (vérifie la
version de wrangler ; sur les anciennes, mettre `experimental_serve_directly = false`).

## Alternative : Cloudflare Pages

Si tu préfères Pages, déploie simplement le contenu de `public/` (le fichier `_headers`
y suffit, pas besoin du Worker).

---

Play! est sous licence **BSD-2-Clause** (© Jean-Philip Desjardins) — voir
`public/PLAY-LICENSE.txt`. **Aucun BIOS ni jeu** n'est distribué (BIOS PS2 en HLE).
