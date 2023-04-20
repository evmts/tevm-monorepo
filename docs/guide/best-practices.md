# Best practices

EVMts is a new way of building evm based frontends so in this guide we will provide some general tips and best practices.

::: info You will learn

- how to name your files
- why you should avoid referencing properties on the contract directly
- TODO

:::

## File naming

By convention contracts that are deployed to a live network should be suffixed `.sol` while scripts that are only executed locally are suffixed `.s.sol`. In future versions EVMts may throw if it detects those files are not following this convention.

## Avoid referencing contract properties directly

EVMts contract imports are meant to be used purely as abstract contract objects. In the following code we simply pass the contract to executeScript.

```typescript
import { executeScript } from "@evmts/core";
import { HelloWorld } from "./HelloWorld.s.sol";

executeScript(HelloWorld).then((greeting) => {
  console.log(greeting);
});
```

This is how EVMts abstracts away the concept of ABIs and contract addresses from the contract code. Similarly it is a bad practice to ever reference properties directly.

```typescript
MyContract.abi;
```

This is for two reasons

1. You should strive to never reference the abi or address in application code.
2. The plugin interface is not stable

If you find yourself reaching into contract properties to pass into another library such as wagmi or ethers consider wrapping their implementations with one that simply takes a generic contract.

- It turns that library into an EVMts library via abstracting away the abi and contract addresses and provides the same dev experience using `@evmts/core` provides
- Should the plugin interface change in future versions you will only need to update it in one spot.
