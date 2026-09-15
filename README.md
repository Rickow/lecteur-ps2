*(English version — [Version française](README.fr.md))*

# Lecteur PS2

A **PlayStation 2** emulator that runs in the browser, wrapped for the **iPhone**. It
packages the official web build of **[Play!](https://github.com/jpd002/Play-)** (BSD) with
a lightweight, touch-first interface and adds the pieces a phone needs: an on-screen
gamepad, save states, a menu, and startup settings.

> **Status: prototype.** PS2 in a browser is heavy. Expect "playable, not smooth" on
> recent iPhones — comparable to PPSSPP-class performance, with occasional glitches.
> The **HLE BIOS is built in**: no BIOS file to provide.

---

## Features

**Emulation**
- **[Play!](https://github.com/jpd002/Play-)** official web core (Emscripten, WebGL2, threaded)
- **HLE BIOS** — nothing copyrighted required
- Disc formats: **.iso .cso .isz .chd .elf**
- **Streaming disc reads** — the disc is read on demand from the file (`blob.slice`), never
  loaded whole into RAM. Suited to 4–8 GB DVDs on a memory-limited device.

**Controls**
- Full **on-screen gamepad**: D-pad (with diagonals) or **left analog stick** (toggle),
  face buttons ▲ ○ ✕ □, L1/L2/L3, R1/R2/R3, START/SELECT — multi-touch.
- **Gamepad API bridge**: a Bluetooth/USB controller works too (Play! only listens to the
  keyboard, so the page translates gamepad input into the keys it expects).

**Menu (☰)**
- **Save states — 3 slots**: save / load / **export** (`.state` file) / **import**.
  Stored in **IndexedDB**, so they survive a page reload.
- **Memory card**: export / import as `.tar` (experimental — internal Play! folder format).
- **Startup settings** (persisted): internal resolution **1× / 2×**, 60 fps limiter on/off.
- **Clear cache & reload**, gamepad and log toggles.

**Measurement overlay**
- Live **FPS · EE% · IOP% · draws/frame**. `EE%` is the Emotion Engine (EE + VU) load — if
  it sits near 100 %, the machine is CPU-bound.

---

## Run it

This is a **threaded** build, so it needs **cross-origin isolation**
(`COOP: same-origin` + `COEP: require-corp` + `CORP: same-origin`, and `application/wasm`
for the `.wasm`). A page served without those headers will show "context not isolated" and
the threads won't start. **`file://` does not work.**

Two ways to serve it:

- **Cloudflare Pages** — deploy the repository root; the included [`_headers`](_headers) sets
  everything. Nothing else needed.
- **Cloudflare Workers** — use [`deploy/`](deploy/) (a Worker that adds the headers on every
  response). See [`deploy/README-DEPLOY.md`](deploy/README-DEPLOY.md).

Then open the URL, pick a disc, and tap **Play** (iOS requires a gesture for audio).
If an old service worker gets in the way, open the page once with `?reset`.

---

## What is NOT provided (and never will be)

- **No games / disc images** — use backups of **your own** discs only.
- **No BIOS** — the emulator runs in **HLE**; nothing copyrighted is distributed here.

---

## Build / modifications

The `Play.js` / `Play.wasm` here are built from Play! upstream
[`83700b2`](https://github.com/jpd002/Play-/commit/83700b2c31e593bc94e845b4b31b797be84dda59)
with a small instrumentation/settings patch to the JS frontend
([`patches/play-ui_js-instrumentation.patch`](patches/play-ui_js-instrumentation.patch)):
it exposes `saveState` / `loadState`, `setResolutionFactor`, `setFrameLimiter`, and per-frame
stats (`getEeUsage` / `getIopUsage` / `getDrawCalls`). Toolchain: Emscripten 4.0.1,
`emcmake cmake --preset wasm-ninja` → `cmake --build --preset wasm-ninja-release`.

See [CREDITS.md](CREDITS.md) for the full list of tools and licenses.

## Credits & license

Emulation is **[Play!](https://github.com/jpd002/Play-)** by Jean-Philip Desjardins
(**BSD-2-Clause**). This wrapper (the `lecteur-ps2.html` UI, `coi-sw.js`, deploy config) is
released under **MIT** — see [LICENSE](LICENSE). Full attributions in [CREDITS.md](CREDITS.md).
