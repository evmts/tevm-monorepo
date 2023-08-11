# createEthersContract()

Creates an [ethers.js contract instance](TODO.link)

- **Example**

::: code-group

```ts [example.ts]
import { ERC20 } from "./ERC20.sol";
import { JsonRpcProvider } from 'ethers'
import { createEthersContract } from "@evmts/ethers";

const CHAIN_ID = 10

const provider = new JsonRpcProvider('https://mainet.optimism.io', CHAIN_ID)

const contract = createEthersContract(ERC20, {
  chainId: CHAIN_ID,
  runner: provider,
})

const balance = await contract.balanceOf('0x8F0EBDaA1cF7106bE861753B0f9F5c0250fE0819')
console.log(balance)
```

```solidity [ERC20.sol]
pragma solidity ^0.8.17;

contract ERC20 {
    ...
}
```

```ts [evmts.config.ts]
import { defineConfig } from "@evmts/config";

/**
 * @see https://evmts.dev/reference/config.html
 */
export default defineConfig(() => ({
  /**
   * Deployments allow evmts to configure default addresses for different networks
   */
  deployments: [
    {
      name: "ERC20",
      address: "0x4204204204204204204204204204204204204204",
    },
  ],
}));
```

:::

- **Live example**

TODO stackblitz

- **See also:** [Viem docs](https://viem.sh/)
