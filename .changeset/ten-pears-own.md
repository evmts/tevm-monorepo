---
"@evmts/bundler": minor
---

Added support for resolving an AST.
Passing in an optional flag to the bundler will return an ast along with comments and abi. By default it's turned off. This AST will be usable in future prs to implement advanced langauge features like goToDefinition
