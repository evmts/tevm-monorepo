---
"@evmts/bundler": minor
"@evmts/rollup-plugin": minor
"@evmts/vite-plugin": minor
"@evmts/ethers": minor
"@evmts/core": minor
"@evmts/cli": minor
---

Major alpha change: remove bytecode from EVMts. Needing the bytecode is a niche use case and removing it improves peformance of the compiler significantly.

This improves peformance by 98% (50x) testing against 101 simple NFT contract imports

