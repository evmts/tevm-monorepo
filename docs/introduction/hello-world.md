# Hello world

## Create a contract

Now let's create a simple hello-world contract `src/HelloWorld.s.sol`.

The `.s.sol` is a convention from [forge scripts](https://book.getfoundry.sh/reference/forge/forge-script). You can think of evmts scripts as being forge scripts you are executing in the browser.

```solidity
pragma solidity 0.8.13;
contract HelloWorld {
    function run() public pure returns (string memory) {
        return "Hello World";
    }
}
```

## Create an EVMts client

The EVMts client is build on top of [viem](https://viem.sh/docs/clients/intro.html) clients and are used to execute the EVM

```typescript
import { httpFork, createPublicClient, optimism } from "@evmts/core";

export const client = createPublicClient({
  chain: optimism,
  transport: httpFork({
    forkUrl: `https://mainnet.optimism.io`,
  }),
});
```

## Now execute the HelloWorld.s.sol script

Simply import the client and the `.s.sol` script to execute clientside

```typescript
import { client } from "./evmtsClient";
import { HelloWorld } from "./HelloWorld.s.sol";

client
  .query({
    script: HelloWorld,
  })
  .then((greeting) => {
    console.log(greeting);
  });
```
