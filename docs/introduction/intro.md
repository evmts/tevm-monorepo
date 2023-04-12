# Why EVMts

EVMts is the union of two new programming paradigms for TypeScript EVM based applications

- Powerful tooling for creating snappy informative user experiences
- A streamlined developer experience with first-class Solidity in JavaScript

## A step up in both user and developer experience

Prior tools have taken huge steps in optimizing both the user and developer experience. [Ethers.js](https://github.com/ethers-io/ethers.js/), [web3js](https://web3js.readthedocs.io/en/v1.8.2/) and [viem](https://viem.sh/) are noteworthy in this regard. But none of these libraries brought the EVM to the browser as a platform.

The user experience improvements come from the powerful core runtime library `@evmts/core`. It enables execution of the EVM clientside which opens doors to many improvements in UX such as faster gas estimation, ability to simulate execution and show the user the event, or use forge cheat codes and a local VM to get data that would otherwise be slow or difficult to get from a remote RPC.

The developer experience improvements come from a new buildtime library `@evmts/plugin`. It's new buildtime plugins allow developers to use Solidity directly in their TypeScript code with full typesafety and no generation step.

EVMts does not replace these libraries. Much of EVMts is built on top of [Viem](https://viem.sh/). EVMts works best alongside these libraries has plans to make the integrations tighter with all popular libraries over time.

## Streamlined developer experience with first-class Solidity support in JavaScript

In EVMts `.sol` are importable via the same tooling that makes other filetypes like graphql, css, sass, coffee script, markdown are. EVMts provides the build tools the ecosystem has needed

- The [@evmts/plugin](../how-plugin-works.md) enables direct solidity imports.
- EVMts abstracts away ABIs and contract addresses into the JavaScript build step
- `@evmts/plugin` supports usage with all libraries including [ethers](../guide/ethers-usage.md) and [viem](../guide/viem-usage.md)

The below code snippet demonstrates the simplicity direct solidity imports provide the API

```typescript
import { client } from "./evmts-client";
import { HelloWorld } from "./HelloWorld.s.sol"; // [!code focus]

client
  .read({
    script: HelloWorld,
  })
  .then((greeting) => {
    console.log(greeting);
  });
```
