---
"@evmts/bundler": minor
---

Added support for natspec comments showing up in EVMts contracts LSP and bundled code. Now when you hover over an EVMts contract any natspec comments will be available as jsdoc comments.

This support is limited based on what [solc](https://docs.soliditylang.org/en/v0.8.17/using-the-compiler.html) supports. In future more robust natspec parsing is expected to be added via [soldity-ast](Add function to parse NatSpec)
![image](https://github.com/evmts/evmts-monorepo/assets/35039927/da3b2c70-f16d-4f47-9de8-c05b4442193f)
