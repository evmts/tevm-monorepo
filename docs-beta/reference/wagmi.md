# forkUrl()

Creates a [viem transport](https://viem.sh/docs/clients/transports/http.html) that talks to the forked vm instance

- **Type:** (options: HttpForkOptions) => viem.Transport

- **Details**

EVMts scripts execute clientside just like forge scripts on a local vm. Only when transactions are broadcasted are they then sent to chain.

The evmts transport will use the local execution environment by default but does proxy some reads/writes to the underlying forkUrl.

- **Example**

```ts
import { readContract } from "@evmts/core";
import { forkUrl } from "@evmts/core"; // [!code focus]
import { createWalletClient } from "viem";
import { optimism } from "viem/chains";

export const client = createWalletClient({
  chain: optimism,
  transport: forkUrl({
    forkUrl: `https://mainnet.optimism.io`, // [!code focus]
    wallet: window.ethereum, // [!code focus]
  }),
});
```
