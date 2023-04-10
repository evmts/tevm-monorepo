# PublicClient

A viem client used for reads

- **Type:** viem.PublicClient

- **Details**

A [viem public client](https://viem.sh/docs/clients/public.html) is used to execute [readScript](./readScript.md) and [readContract](./readContract.md). In ethers.js this is called a [ethers provider](https://viem.sh/docs/ethers-migration.html#provider-%E2%86%92-client). It can only access public [JSON-RPC](https://ethereum.org/en/developers/docs/apis/json-rpc/) methods.

- **Example**

```ts
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

- **See also:** [Scripting](/guide/scripting)
