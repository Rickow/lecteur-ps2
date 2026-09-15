*(Version française — [English version](README.md))*

# Lecteur PS2

Un émulateur **PlayStation 2** qui tourne dans le navigateur, emballé pour l'**iPhone**. Il
empaquette le build web officiel de **[Play!](https://github.com/jpd002/Play-)** (BSD) avec
une interface légère et tactile, et ajoute ce qu'il faut sur téléphone : une manette à
l'écran, des sauvegardes d'état, un menu et des réglages au démarrage.

> **Statut : prototype.** La PS2 dans un navigateur, c'est lourd. Attends-toi à « jouable,
> pas fluide » sur iPhone récent — comparable à du PPSSPP, avec quelques glitchs. Le
> **BIOS HLE est intégré** : aucun fichier BIOS à fournir.

---

## Fonctions

**Émulation**
- Cœur web officiel **[Play!](https://github.com/jpd002/Play-)** (Emscripten, WebGL2, threadé)
- **BIOS HLE** — rien de copyright à fournir
- Formats disque : **.iso .cso .isz .chd .elf**
- **Lecture disque en flux** — le disque est lu à la demande depuis le fichier
  (`blob.slice`), jamais chargé entièrement en RAM. Adapté aux DVD de 4–8 Go sur un appareil
  à mémoire limitée.

**Contrôles**
- **Manette tactile** complète : croix directionnelle (avec diagonales) ou **stick
  analogique gauche** (bascule), boutons ▲ ○ ✕ □, L1/L2/L3, R1/R2/R3, START/SELECT —
  multi-touch.
- **Pont Gamepad API** : une manette Bluetooth/USB fonctionne aussi (Play! n'écoute que le
  clavier, la page traduit donc la manette vers les touches attendues).

**Menu (☰)**
- **Sauvegardes rapides — 3 slots** : sauver / charger / **exporter** (fichier `.state`) /
  **importer**. Stockées en **IndexedDB**, elles survivent au rechargement de la page.
- **Carte mémoire** : export / import en `.tar` (expérimental — format dossier interne à Play!).
- **Réglages au démarrage** (persistés) : résolution interne **1× / 2×**, limiteur 60 fps.
- **Vider le cache & recharger**, bascules manette et journal.

**Surcouche de mesure**
- **FPS · EE% · IOP% · dessins/frame** en direct. `EE%` = charge de l'Emotion Engine
  (EE + VU) — proche de 100 %, on est limité par le CPU.

---

## Le lancer

C'est un build **threadé**, il exige l'**isolation cross-origin**
(`COOP: same-origin` + `COEP: require-corp` + `CORP: same-origin`, et `application/wasm`
pour le `.wasm`). Servie sans ces en-têtes, la page affiche « contexte non isolé » et les
threads ne démarrent pas. **Le `file://` ne marche pas.**

Deux façons de servir :

- **Cloudflare Pages** — déploie la racine du dépôt ; le fichier [`_headers`](_headers) inclus
  pose tout. Rien d'autre à faire.
- **Cloudflare Workers** — utilise [`deploy/`](deploy/) (un Worker qui ajoute les en-têtes sur
  chaque réponse). Voir [`deploy/README-DEPLOY.md`](deploy/README-DEPLOY.md).

Ouvre l'URL, choisis un disque, et tape **Play** (iOS exige un geste pour le son). Si un vieux
service worker gêne, ouvre la page une fois avec `?reset`.

---

## Ce qui n'est PAS fourni (et ne le sera jamais)

- **Aucun jeu / image disque** — uniquement des sauvegardes de **tes propres** disques.
- **Aucun BIOS** — l'émulateur tourne en **HLE** ; rien de copyright n'est distribué ici.

---

## Build / modifications

Les `Play.js` / `Play.wasm` sont compilés depuis Play! upstream
[`83700b2`](https://github.com/jpd002/Play-/commit/83700b2c31e593bc94e845b4b31b797be84dda59)
avec un petit patch d'instrumentation/réglages du frontend JS
([`patches/play-ui_js-instrumentation.patch`](patches/play-ui_js-instrumentation.patch)) :
il expose `saveState` / `loadState`, `setResolutionFactor`, `setFrameLimiter` et des stats par
frame (`getEeUsage` / `getIopUsage` / `getDrawCalls`). Toolchain : Emscripten 4.0.1,
`emcmake cmake --preset wasm-ninja` → `cmake --build --preset wasm-ninja-release`.

Voir [CREDITS.md](CREDITS.md) pour la liste complète des outils et licences.

## Crédits & licence

L'émulation, c'est **[Play!](https://github.com/jpd002/Play-)** de Jean-Philip Desjardins
(**BSD-2-Clause**). Ce wrapper (l'UI `lecteur-ps2.html`, `coi-sw.js`, la config de déploiement)
est publié sous **MIT** — voir [LICENSE](LICENSE). Attributions complètes dans
[CREDITS.md](CREDITS.md).
