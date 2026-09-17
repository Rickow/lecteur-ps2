# Changelog

## v0.3.0 — 2026-09-17

Controls, memory-card `.ps2`, persistence and full backup.

**Memory card**
- Import / **export as a standard `.ps2` image** (8 MiB, PCSX2 / real-PS2 / mymc compatible),
  via the **ps2vmc-tool** engine compiled to WebAssembly (`ps2mc.wasm`, source in `mc-tool/`).
- **Automatic persistence**: the card is snapshotted to IndexedDB (interval + on hide/close)
  and restored into Play!'s folder before a game boots.

**Saves**
- **Full backup**: "export everything" / "import everything" as a single `.zip` (all save
  states + the memory card).

**Controls**
- Touch pad re-laid-out with `vmin` so it fits portrait **and** landscape; safe-area aware so
  the burger menu and controls stay reachable under the notch / home indicator.
- **D-pad ⇄ Analog** toggle for the left cluster, remembered across reloads.

**Fixes**
- iOS Safari: `initVm` (WebGL2 context creation) is now **deferred to the first tap**, so the
  context is created inside a user gesture — fixes the `clearColor`/`clearDepth` launch error.

**Licensing**
- Repository moves to **GPL-3.0** (it now bundles `ps2mc.wasm`, GPL-3.0). Play! stays
  BSD-2-Clause; our original wrapper code is also offered under MIT (`LICENSE.MIT`).

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
