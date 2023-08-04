---
"@evmts/bundler": minor
---

Added support for monorepo imports and node_module imports

Previously, these use cases would fail because @evmts/core was not in scope. EVMts injects a module that uses the `@evmts/core` package to create the contract objects at runtime. These packages are installed to the users node_modules and thus were not in scope for sub dependencies and other workspaces. @evmts/core now handles this via always importing @evmts/core from the users main workspace.  This feature enables 2 use cases. 

## Use case 1 - Importing from Node Modules

A solid way to use EVMts is to install a package that has contracts in it and import the contract from node module

```
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { viemPublicClient, Address } from './publicClient'

const balanceOf = (address: Address) => viemPublicClient.readContract(ERC20.balanceOf(
```
## Use case 2 - Importing from PNPM monorepos

Devs commonly use monorepo tools such as npm workspaces, yarn workspaces, or pnpm workspaces. Previously these tools failed to work correctly but are now supported.
