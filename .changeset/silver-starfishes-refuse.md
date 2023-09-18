---
"@evmts/bundler": patch
"@evmts/esbuild-plugin": patch
"@evmts/webpack-plugin": patch
"@evmts/rollup-plugin": patch
"@evmts/rspack-plugin": patch
"@evmts/vite-plugin": patch
"@evmts/bun-plugin": patch
---

Improved peformance of bundler via enabling async mode

Previously all bundlers including the Bun bundler ran with syncronous IO such as readFileSync. With the introduction of async mode the bundler now is more non blocking when it is bundling now. Solc is still syncronous but all IO is now async.

@evmts/bundler now takes a File-Access-Object as a param. This FileAccessObject is the same shape as `node:fs` module. Bun uses this generic interace to use native Bun file access.

