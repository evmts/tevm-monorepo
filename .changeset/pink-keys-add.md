---
"@tevm/unplugin": patch
"@tevm/esbuild-plugin": patch
"@tevm/webpack-plugin": patch
"@tevm/rollup-plugin": patch
"@tevm/rspack-plugin": patch
"@tevm/vite-plugin": patch
"@tevm/bun-plugin": patch
"@tevm/resolutions": patch
"@tevm/ts-plugin": patch
"@tevm/runtime": patch
"@tevm/config": patch
"@tevm/effect": patch
"@tevm/ethers": patch
"@tevm/state": patch
"@tevm/contract": patch
"@tevm/solc": patch
---

Added --declaration-map to typescript build. This generates source maps so LSPs can point to the original javascript code rather than the generated .d.ts files
