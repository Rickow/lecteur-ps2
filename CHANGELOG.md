# Changelog

## v0.2.0 — 2026-09-15

Feature parity with the other players + an instrumented Play! build.

**Core (rebuilt from Play! `83700b2`)**
- Exposed `saveState` / `loadState` (save states).
- Exposed `setResolutionFactor` (internal resolution, upscale only) and `setFrameLimiter`.
- Exposed per-frame stats: `getEeUsage`, `getIopUsage`, `getDrawCalls` (wired `OnNewFrame`
  to the stats manager, which the web build did not do).

**Interface**
- **Burger menu** (☰).
- **Save states — 3 slots**, persisted in IndexedDB, with export (`.state`) / import.
- **Memory card** export / import as `.tar` (experimental).
- **Startup settings**: internal resolution 1× / 2×, 60 fps limiter — persisted, applied
  before `initVm`.
- **Clear cache & reload**; gamepad / log toggles.
- Measurement overlay: **FPS · EE% · IOP% · draws/frame**.

**Notes on optimization** — Play!'s web renderer already runs at native resolution (its
factor only upscales, no sub-native), the VU JIT already emits SIMD128, and there is no clean
GS frameskip hook. So there is no magic runtime speed lever here; `EE%` tells whether a title
is CPU-bound.

## v0.1.0 — 2026-09-15

First working prototype.
- Wraps the official Play! web build (HLE BIOS, threaded, WebGL2).
- **Streaming disc reads** via a custom disc-image device (`blob.slice`), no full RAM load.
- On-screen gamepad (D-pad / left stick, face buttons, shoulders, START/SELECT) with a
  Gamepad API → keyboard bridge.
- Cross-origin isolation via server headers (`_headers` / Worker) with a fallback service
  worker for the tab.
