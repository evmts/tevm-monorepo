---
"@evmts/bundler": minor
"@evmts/rollup-plugin": minor
"@evmts/vite-plugin": minor
"@evmts/ethers": minor
"@evmts/core": minor
"@evmts/cli": minor
---

Improve peformance by 98% (5x) testing against 101 simple NFT contract imports

Major change: remove bytecode from EVMts. Needing the bytecode is a niche use case and removing it improves peformance of the compiler significantly. In future bytecode will be brought back as an optional prop

This improves peformance by 98% (50x) testing against 101 simple NFT contract imports

Because EVMts is still considered in alpha this will not cause a major semver bump
