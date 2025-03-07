---
"@tevm/sync-storage-persister": patch
"@tevm/bundler-cache": patch
"@tevm/base-bundler": patch
"@tevm/resolutions": patch
"@tevm/compiler": patch
"@tevm/unplugin": patch
"@tevm/esbuild-plugin": patch
"@tevm/runtime": patch
"@tevm/webpack-plugin": patch
"@tevm/receipt-manager": patch
"@tevm/config": patch
"@tevm/rollup-plugin": patch
"@tevm/rspack-plugin": patch
"@tevm/memory-client": patch
"@tevm/solc": patch
"@tevm/vite-plugin": patch
"@tevm/client-types": patch
"@tevm/bun-plugin": patch
"@tevm/node": patch
"@tevm/http-client": patch
"@tevm/precompiles": patch
"@tevm/blockchain": patch
"@tevm/decorators": patch
"@tevm/predeploys": patch
"@tevm/procedures": patch
"@tevm/tsupconfig": patch
"@tevm/ethers": patch
"@tevm/contract": patch
"@tevm/tsconfig": patch
"@tevm/actions": patch
"@tevm/jsonrpc": patch
"@tevm/viem": patch
"@tevm/common": patch
"@tevm/effect": patch
"@tevm/errors": patch
"@tevm/logger": patch
"@tevm/server": patch
"@tevm/txpool": patch
"@tevm/test-utils": patch
"@tevm/block": patch
"@tevm/state": patch
"@tevm/utils": patch
"@tevm/ts-plugin": patch
"@tevm/trie": patch
"@tevm/evm": patch
"@tevm/rlp": patch
"@tevm/tx": patch
"@tevm/vm": patch
"@tevm/vscode": patch
"@tevm/lsp": patch
"tevm": patch
---

Moved files around to colocate code better. Some packages are disappearing

- Tevm/Zod is now part of Tevm/actions
- Tevm/actions-types moved to Tevm/actions
- Tevm/procedures-types moved to Tevm/procedures
