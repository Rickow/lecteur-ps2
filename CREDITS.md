# Credits & licences

This project **only assembles and wraps** an outstanding open-source emulator. All the
emulation credit belongs to its authors. Thank you.

## Engine & core

| Component | Role | License |
|---|---|---|
| **[Play!](https://github.com/jpd002/Play-)** — by Jean-Philip Desjardins | PlayStation 2 emulator (EE/VU/IOP/GS), HLE BIOS, official Emscripten web build | **BSD-2-Clause** |
| **[Play!-CodeGen](https://github.com/jpd002/Play--CodeGen)** | Play!'s portable JIT — the WebAssembly backend emits **SIMD128** for the VU | BSD-2-Clause |
| **[Play!-Framework](https://github.com/jpd002/Play--Framework)** | base framework used by Play! | BSD-2-Clause |
| **[Emscripten](https://emscripten.org/)** | C/C++ → WebAssembly toolchain (used to build the core) | MIT / NCSA |

## Bundled third-party pieces (inside the Play! build)

| Component | Role | License |
|---|---|---|
| **[libchdr](https://github.com/rtissera/libchdr)** | CHD disc image reading | BSD-3-Clause |
| **[zstd](https://github.com/facebook/zstd)** / **zlib** / **bzip2** | CHD/compression codecs | BSD / zlib / bzip2 |
| **[nlohmann/json](https://github.com/nlohmann/json)** | JSON | MIT |
| **[SQLite](https://sqlite.org/)** | embedded database | Public domain |

## Wrapper (this repository)

The single-file interface — on-screen gamepad, Gamepad API bridge, burger menu, save-state
slots (IndexedDB), memory-card export/import, startup settings, measurement overlay — plus
`coi-sw.js` (fallback COOP/COEP service worker), `_headers`, `cloudflare-worker.js` and the
`deploy/` Worker. Original code, released under **MIT** (see [`LICENSE`](LICENSE)).

## Modifications to Play!

A small patch to the JS frontend (`Source/ui_js/Main.cpp`), provided at
[`patches/play-ui_js-instrumentation.patch`](patches/play-ui_js-instrumentation.patch),
against upstream commit
[`83700b2`](https://github.com/jpd002/Play-/commit/83700b2c31e593bc94e845b4b31b797be84dda59):
it exposes `saveState`/`loadState`, `setResolutionFactor`, `setFrameLimiter`, and per-frame
statistics (`getEeUsage`/`getIopUsage`/`getDrawCalls`). Play! is BSD-2-Clause; its license and
copyright notice are kept in [`PLAY-LICENSE.txt`](PLAY-LICENSE.txt).

## ⚠️ What is NOT provided (and never will be)

- **No ROMs / disc images** — use backups of **your own** games only.
- **No BIOS** — the emulator runs in **HLE** by default; **nothing copyrighted is distributed
  here**.
