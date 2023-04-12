# PublicClient

A viem client used for reads

- **Type:** viem.PublicClient

- **Details**

A [viem public client](https://viem.sh/docs/clients/public.html) is used read from blockchain. In ethers.js this is called a [ethers provider](https://viem.sh/docs/ethers-migration.html#provider-%E2%86%92-client). It can only access public [JSON-RPC](https://ethereum.org/en/developers/docs/apis/json-rpc/) methods.

- **Example**

```ts
import { httpFork, createPublicClient, optimism } from "@evmts/core";

export const client = createPublicClient({
  chain: optimism,
  transport: httpFork({
    forkUrl: `https://mainnet.optimism.io`,
  }),
});
```

- **See also:** [Scripting](/guide/scripting)
