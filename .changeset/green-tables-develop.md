---
"@evmts/vite-plugin": minor
---

Added example app of usage of vite plugin in MUD framework

## What is mud
MUD is a framework for ambitious Ethereum applications. It compresses the complexity of building EVM apps with a tightly integrated software stack.
MUD and EVMts have similar goals. EVMts is approaching it from an unopionionated modular point of view whereas MUD is more of a batteries included opionated framework more similar to Ruby on Rails or NEXT.js. They don't compete with each other in their full form they very much complement each other.
MUD's template only has a single contract import but this can be improved upon in future as that one contract is an entrypoint to system contracts. Also EVMts provides a more streamlined way to interact with third party contracts not built with MUD storage

This mud template is also the first usage of EVMts in a monorepo. Usage in PNPM monorepo which is the strictist type of monorepo validates that EVMts works in all monorepos. This example project and it's upcoming e2e test will provide a tool to debug monorepos and test coverage for this use case

