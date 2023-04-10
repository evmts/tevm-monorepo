# PublicClient

A viem client used for reads

- **Type:** viem.WalletClient

- **Details**

A [viem wallet client](https://viem.sh/docs/clients/wallet.html) is used to execute [writeScript](./write-script.md) and [writeContract](./write-contract.md). In ethers.js this is called a [ethers signer](https://viem.sh/docs/ethers-migration.html#signers-%E2%86%92-accounts)

- **Example**

```ts
import { readContract } from "@evmts/core";
import { httpFork } from "@evmts/core";
import { createWalletClient } from "viem";
import { optimism } from "viem/chains";

export const client = createWalletClient({
  chain: optimism,
  transport: httpFork({
    chain: optimism,
    forkUrl: `https://mainnet.optimism.io`,
    wallet: window.ethereum,
  }),
});
```
