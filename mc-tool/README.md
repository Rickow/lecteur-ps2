# mc-tool — PS2 memory-card engine (WASM)

`ps2mc.js` / `ps2mc.wasm` (in the repo root) are built from these sources. They read and write
**standard PS2 memory-card images** (`.ps2` / `.vmc`, 8,650,752 bytes = 16384 pages × 528,
i.e. 512 data + 16 ECC), so a card exported here opens in PCSX2 / on a real PS2 / in `mymc`.

## What's here

- `src/mcio.c`, `src/util.c`, `src/mcio.h`, `src/util.h` — the memory-card filesystem engine
  (superblock, FAT, directory entries, ECC, backup blocks) from
  **[bucanero/ps2vmc-tool](https://github.com/bucanero/ps2vmc-tool)** (originally ps3mca-tool
  by jimmikaelkael). **GPL-3.0.**
- `src/mcbridge.c` — a thin, flat wrapper exposing `mcb_format / mcb_mount / mcb_mkdir /
  mcb_write / mcb_size / mcb_read / mcb_list / mcb_flush / mcb_getfree` so the page can drive
  the engine from JavaScript without struct marshaling. GPL-3.0 (links mcio).

## Build

```bash
emcc -O2 -Isrc src/mcio.c src/util.c src/mcbridge.c -o ps2mc.js \
  -sMODULARIZE=1 -sEXPORT_NAME=PS2MC -sEXPORT_ES6=0 -sENVIRONMENT=web \
  -sINITIAL_MEMORY=33554432 -sALLOW_MEMORY_GROWTH=1 \
  -sEXPORTED_FUNCTIONS='["_mcb_format","_mcb_mount","_mcb_flush","_mcb_mkdir","_mcb_getfree","_mcb_write","_mcb_size","_mcb_read","_mcb_list","_malloc","_free"]' \
  -sEXPORTED_RUNTIME_METHODS='["ccall","cwrap","HEAPU8","stringToUTF8","UTF8ToString","lengthBytesUTF8"]'
```

## Licence

**GPL-3.0** — because it embeds `ps2vmc-tool` (GPL-3.0). This is why the repository as a whole
is distributed under GPL-3.0. See the repo's [`CREDITS.md`](../CREDITS.md).
