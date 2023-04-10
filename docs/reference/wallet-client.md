# WalletClient

A viem wallet client is used by evmts to make writes

- **Type:** viem.WalletClient

- **Details**

A [viem wallet client](https://viem.sh/docs/clients/wallet.html) is used write to blockchain as well as tell evmts the public key of the signers in script simulation. In ethers.js this is called a [ethers signer](https://viem.sh/docs/ethers-migration.html#signers-%E2%86%92-accounts)

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
