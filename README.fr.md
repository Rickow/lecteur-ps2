*(Version française — [English version](README.md))*

# Lecteur PS2

Un émulateur **PlayStation 2** qui tourne dans le navigateur, emballé pour l'**iPhone**. Il
empaquette le build web officiel de **[Play!](https://github.com/jpd002/Play-)** (BSD) avec
une interface tactile : manette à l'écran, sauvegardes d'état, import/export de la carte
mémoire en vraies images `.ps2`, persistance automatique et réglages au démarrage.

> **Statut : prototype.** La PS2 dans un navigateur, c'est lourd — « jouable, pas fluide » sur
> iPhone récent, avec quelques glitchs. Le **BIOS HLE est intégré** : aucun fichier BIOS à
> fournir.

---

## Fonctions

**Émulation**
- Cœur web officiel **[Play!](https://github.com/jpd002/Play-)** (Emscripten, WebGL2, threadé), **BIOS HLE**
- Formats disque : **.iso .cso .isz .chd .elf**
- **Lecture disque en flux** (`blob.slice`) — lu à la demande, jamais chargé entièrement en
  RAM. Adapté aux DVD de 4–8 Go sur un appareil à mémoire limitée.

**Contrôles**
- **Manette tactile** complète : croix directionnelle / **stick analogique gauche** (bascule
  mémorisée), boutons ▲ ○ ✕ □, L1/L2/L3, R1/R2/R3, START/SELECT — multi-touch, disposée pour
  le portrait et le paysage (zones sûres respectées).
- **Pont Gamepad API** : les manettes Bluetooth/USB marchent aussi (Play! ne lit que le
  clavier, la page traduit donc la manette vers les touches attendues).

**Menu (☰)**
- **Sauvegardes rapides — 3 slots** : sauver / charger / exporter (`.state`) / importer,
  gardées en IndexedDB.
- **Carte mémoire** : export / import en **image `.ps2` standard** (compatible PCSX2 / vraie
  PS2 / mymc), plus **persistance automatique** — la carte est copiée dans IndexedDB et
  restaurée avant le lancement d'un jeu.
- **Sauvegarde complète** : un seul `.zip` avec tous les états + la carte mémoire, pour tout
  sauvegarder ou migrer vers un autre appareil.
- **Réglages au démarrage** (persistés) : résolution interne 1× / 2×, limiteur 60 fps.
- **Vider le cache & recharger**.

**Surcouche de mesure** : **FPS · EE% · IOP% · dessins/frame** en direct (`EE%` ≈ 100 % ⇒
limité par le CPU).

---

## Le lancer

Build **threadé** → il exige l'**isolation cross-origin** (`COOP: same-origin` +
`COEP: require-corp` + `CORP: same-origin`, et `application/wasm` pour les `.wasm`). Le
`file://` ne marche pas. Deux façons de servir :

- **Cloudflare Pages** — déploie la racine du dépôt ; le fichier [`_headers`](_headers) pose
  tout.
- **Cloudflare Workers** — utilise [`deploy/`](deploy/) (un Worker qui ajoute les en-têtes).
  Voir [`deploy/README-DEPLOY.md`](deploy/README-DEPLOY.md).

Ouvre l'URL, tape **Démarrer** (le contexte WebGL est créé dans ce geste — iOS Safari exige
un geste utilisateur), puis choisis un disque.

---

## Ce qui n'est PAS fourni (et ne le sera jamais)

- **Aucun jeu / image disque** — uniquement des sauvegardes de **tes propres** disques.
- **Aucun BIOS** — l'émulateur tourne en **HLE** ; rien de copyright n'est distribué ici.

---

## Build / modifications

`Play.js` / `Play.wasm` sont compilés depuis Play! upstream
[`83700b2`](https://github.com/jpd002/Play-/commit/83700b2c31e593bc94e845b4b31b797be84dda59)
avec un petit patch du frontend JS ([`patches/`](patches/)) exposant `saveState`/`loadState`,
`setResolutionFactor`, `setFrameLimiter` et des stats par frame. `ps2mc.js`/`ps2mc.wasm` (le
moteur de carte mémoire) sont compilés depuis [`mc-tool/`](mc-tool/). Toolchain : Emscripten
4.0.1.

## Licences

- **Le dépôt dans son ensemble est distribué sous [GPL-3.0](LICENSE)**, car il embarque le
  moteur de carte mémoire **[ps2vmc-tool](https://github.com/bucanero/ps2vmc-tool)** (GPL-3.0,
  livré comme `ps2mc.wasm`).
- L'**émulateur PS2 Play!** (`Play.js`, `Play.wasm`) est en **BSD-2-Clause** (© Jean-Philip
  Desjardins) — voir [`PLAY-LICENSE.txt`](PLAY-LICENSE.txt).
- Notre **propre code original** (l'interface `lecteur-ps2.html`, `coi-sw.js`, la config de
  déploiement) est **aussi proposé sous licence MIT** — voir [`LICENSE.MIT`](LICENSE.MIT).
  Prends ces fichiers et fais-en ce que tu veux sous MIT.

Voir [CREDITS.md](CREDITS.md) pour la liste complète des outils et licences.
