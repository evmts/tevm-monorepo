---
"@tevm/base-bundler": patch
"@tevm/bun-plugin": patch
"@tevm/bundler-cache": patch
"@tevm/compiler": patch
"@tevm/config": patch
"@tevm/esbuild-plugin": patch
"@tevm/resolutions": patch
"@tevm/rollup-plugin": patch
"@tevm/rspack-plugin": patch
"@tevm/runtime": patch
"@tevm/solc": patch
"@tevm/unplugin": patch
"@tevm/vite-plugin": patch
"@tevm/webpack-plugin": patch
"@tevm/tsconfig": patch
"@tevm/tsupconfig": patch
"@tevm/ethers": patch
"@tevm/viem": patch
"@tevm/lsp": patch
"@tevm/ts-plugin": patch
"@tevm/vscode": patch
"@tevm/actions": patch
"@tevm/client-types": patch
"@tevm/contract": patch
"@tevm/effect": patch
"@tevm/errors": patch
"@tevm/http-client": patch
"@tevm/jsonrpc": patch
"@tevm/memory-client": patch
"@tevm/predeploys": patch
"@tevm/procedures": patch
"@tevm/server": patch
"@tevm/state": patch
"tevm": patch
---

- Renamed MemoryTevm MemoryClient
- Renamed TevmClient HttpClient
- Replaced @tevm/actions package with @tevm/actions, @tevm/client-types, and @tevm/procedures packages
- Moved errors to @tevm/errors
- Moved bundler packages out of tevm and to @tevm/bundler package
- Minimized packages exposed in tevm package
- Fixed bug with missing types exports
