# httpFork()

Creates a [viem transport](https://viem.sh/docs/clients/transports/http.html) that talks to the forked vm instance

- **Type:** (options: HttpForkOptions) => viem.Transport

- **Details**

EVMts scripts execute clientside just like forge scripts on a local vm. Only when transactions are broadcasted are they then sent to chain.

The evmts transport will use the local execution environment by default but does proxy some reads/writes to the underlying forkUrl.

If familiar with forge, you can think of EVMts [execute](./execute.md) as calling [forge script](https://book.getfoundry.sh/tutorials/solidity-scripting) on your `.s.sol` script file and this transport as being [anvil](https://book.getfoundry.sh/anvil/)

- **Example**

```ts
import { readContract } from "@evmts/core";
import { httpFork } from "@evmts/core"; // [!code focus]
import { createWalletClient } from "viem";
import { optimism } from "viem/chains";

export const client = createWalletClient({
  chain: optimism,
  transport: httpFork({ // [!code focus]
    chain: optimism, // [!code focus]
    forkUrl: `https://mainnet.optimism.io`, // [!code focus]
    wallet: window.ethereum, // [!code focus]
  }), // [!code focus]
});
```
