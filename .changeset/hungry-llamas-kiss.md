---
"@evmts/config": major
---

Updated evmts/config to be effect.ts based. Effect.ts allows for more robust error handling of config loading. Config package is used mostly internally by EVMts which will all be using Effect internally so the config package no longer resolves configs as values but as Effects completely
