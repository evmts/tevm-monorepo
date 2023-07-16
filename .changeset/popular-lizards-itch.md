---
"@evmts/bundler": minor
"@evmts/ts-plugin": minor
"@evmts/config": minor
"@evmts/esbuild-plugin": minor
"@evmts/rollup-plugin": minor
"@evmts/rspack-plugin": minor
"@evmts/vite-plugin": minor
"@evmts/webpack-plugin": minor
---

Updated config schema to support etherscan
- Solc version is now listed under `compiler.solcVersion` instead of `solc`
- Foundry projects are now listed under `compiler.foundryProject` instead of `forge`
- Local contracts are now specified under `localContracts.contracts` instead of `deployments`
- New external option (unimplemented) `externalContracts` which is used to specifify contracts imported from etherscan in the next release
