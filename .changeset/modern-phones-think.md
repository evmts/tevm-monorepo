---
"@evmts/bundler": patch
---

Internal change: Made usage of solc typesafe

This change adds new solc types to the [solc](https://github.com/ethereum/solc-bin) peer dependency used by EVMts. This is used by @evmts/bundler to

- includes type for SolcInputSources and outputsources

![image](https://github.com/evmts/evmts-monorepo/assets/35039927/1ee13b76-98ab-4f62-9266-6e4a972de223)

These types were adapted from [solc documentation](https://docs.soliditylang.org/en/v0.8.17/using-the-compiler.html#compiler-input-and-output-json-description)

Shout out @o-az who kicked off this improvement in #435
