*(English version — [Version française](README.fr.md))*

# Lecteur PS2

A **PlayStation 2** emulator that runs in the browser, wrapped for the **iPhone**. It
packages the official web build of **[Play!](https://github.com/jpd002/Play-)** (BSD) with a
touch-first interface: on-screen gamepad, save states, memory-card import/export as real
`.ps2` images, automatic persistence, and startup settings.

> **Status: prototype.** PS2 in a browser is heavy — expect "playable, not smooth" on recent
> iPhones, with occasional glitches. The **HLE BIOS is built in**: no BIOS file to provide.

---

## Features

**Emulation**
- **[Play!](https://github.com/jpd002/Play-)** official web core (Emscripten, WebGL2, threaded), **HLE BIOS**
- Disc formats: **.iso .cso .isz .chd .elf**
- **Streaming disc reads** (`blob.slice`) — the disc is read on demand, never loaded whole
  into RAM. Suited to 4–8 GB DVDs on a memory-limited device.

**Controls**
- Full **on-screen gamepad**: D-pad / **left analog stick** (toggle, remembered), face buttons
  ▲ ○ ✕ □, L1/L2/L3, R1/R2/R3, START/SELECT — multi-touch, laid out for portrait and
  landscape (safe-area aware).
- **Gamepad API bridge**: Bluetooth/USB controllers work too (Play! only reads the keyboard,
  so the page translates the pad into the keys it expects).

**Menu (☰)**
- **Save states — 3 slots**: save / load / export (`.state`) / import, kept in IndexedDB.
- **Memory card**: export / import a **standard `.ps2` image** (PCSX2 / real-PS2 / mymc
  compatible), plus **automatic persistence** — the card is snapshotted to IndexedDB and
  restored before a game boots.
- **Full backup**: one `.zip` with every save state + the memory card, to back up or move to
  another device.
- **Startup settings** (persisted): internal resolution 1× / 2×, 60 fps limiter.
- **Clear cache & reload**.

**Measurement overlay**: live **FPS · EE% · IOP% · draws/frame** (`EE%` ≈ 100 % ⇒ CPU-bound).

---

## Run it

This is a **threaded** build → it needs **cross-origin isolation** (`COOP: same-origin` +
`COEP: require-corp` + `CORP: same-origin`, and `application/wasm` for `.wasm`). `file://`
does not work. Serve it either way:

- **Cloudflare Pages** — deploy the repository root; the included [`_headers`](_headers) sets
  everything.
- **Cloudflare Workers** — use [`deploy/`](deploy/) (a Worker that adds the headers). See
  [`deploy/README-DEPLOY.md`](deploy/README-DEPLOY.md).

Open the URL, tap **Démarrer** (the WebGL context is created inside that tap — iOS Safari
requires a user gesture), then pick a disc.

---

## What is NOT provided (and never will be)

- **No games / disc images** — use backups of **your own** discs only.
- **No BIOS** — the emulator runs in **HLE**; nothing copyrighted is distributed here.

---

## Build / modifications

`Play.js` / `Play.wasm` are built from Play! upstream
[`83700b2`](https://github.com/jpd002/Play-/commit/83700b2c31e593bc94e845b4b31b797be84dda59)
with a small JS-frontend patch ([`patches/`](patches/)) exposing `saveState`/`loadState`,
`setResolutionFactor`, `setFrameLimiter` and per-frame stats. `ps2mc.js`/`ps2mc.wasm` (the
memory-card engine) are built from [`mc-tool/`](mc-tool/). Toolchain: Emscripten 4.0.1.

## Licensing

- **The repository as a whole is distributed under [GPL-3.0](LICENSE)**, because it bundles
  the memory-card engine **[ps2vmc-tool](https://github.com/bucanero/ps2vmc-tool)** (GPL-3.0,
  shipped as `ps2mc.wasm`).
- The **PS2 emulator Play!** (`Play.js`, `Play.wasm`) is **BSD-2-Clause** (© Jean-Philip
  Desjardins) — see [`PLAY-LICENSE.txt`](PLAY-LICENSE.txt).
- Our **own original wrapper code** (the `lecteur-ps2.html` interface, `coi-sw.js`, deploy
  config) is **also offered under the MIT License** — see [`LICENSE.MIT`](LICENSE.MIT). Take
  those files and do what you want with them under MIT.

See [CREDITS.md](CREDITS.md) for the full list of tools and licenses.
