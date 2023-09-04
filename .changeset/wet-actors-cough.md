---
"@evmts/bundler": minor
---

Added solcInput and solcOutput to return objects for bundler. 

Now in addition to the compiled code and the modules solcInput and solcOutput are also added along with the recently added asts property

![image](https://github.com/evmts/evmts-monorepo/assets/35039927/57277b41-195c-4c54-ab70-a4e1ef3fceaa)

This will be used internally to implement go-to-definition LSP support to [@evmts/ts-plugin](https://github.com/evmts/evmts-monorepo/tree/main/ts-plugin)
