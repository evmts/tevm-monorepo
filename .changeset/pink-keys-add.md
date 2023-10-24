---
"@evmts/unplugin": patch
"@evmts/experimental-solc": patch
"@evmts/bundler": patch
"@evmts/esbuild-plugin": patch
"@evmts/webpack-plugin": patch
"@evmts/rollup-plugin": patch
"@evmts/rspack-plugin": patch
"@evmts/blockexplorer": patch
"@evmts/vite-plugin": patch
"@evmts/bun-plugin": patch
"@evmts/resolutions": patch
"@evmts/ts-plugin": patch
"@evmts/runtime": patch
"@evmts/schemas": patch
"@evmts/config": patch
"@evmts/effect": patch
"@evmts/ethers": patch
"@evmts/state": patch
"@evmts/core": patch
"@evmts/solc": patch
---

Added --declaration-map to typescript build. This generates source maps so LSPs can point to the original javascript code rather than the generated .d.ts files
