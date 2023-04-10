# readContract()

Reads a contract deployed on a live chain.

- **Type**

```ts
function readContract(
  script: Script,
  options?: ScriptOptions
): Promise<ScriptResult>;
```

- **Details**

readContract is a very thin wrapper around [readContract](https://viem.sh/docs/contract/readContract.html) from `viem`. It simply calls
readContract but with the following advantages thanks to the [evmts plugin](../how-plugin-works.md):

- No need to pass in the contract abi
- No need to pass in the contract address

Use [readContract](https://viem.sh/docs/contract/readContract.html) from `viem` to read a contract deployed to a live. EVMts plugs into viem natively.

- **Example**

::: code-group

```ts [example.ts]
import { client } from "./client";
import { HelloWorld } from "./HelloWorld";

const data = await readContract({
  client,
  contract: HelloWorld,
  functionName: "greet",
});
```

```solidity [HelloWorld.sol]
pragma solidity ^0.8.17;

contract HelloWorld {
    string public greet = "Hello World!";
}
```

```ts [client.ts]
import { httpFork } from "@evmts/core";
import { createPublicClient } from "viem";
import { optimism } from "viem/chains";

export const client = createPublicClient({
  chain: optimism,
  transport: httpFork({
    chain: optimism,
    forkUrl: `https://mainnet.optimism.io`,
  }),
});
```

:::
