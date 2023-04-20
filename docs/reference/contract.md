# Client.contract()

Returns a viem contract

- **Type**

```ts
function contract(
  contract: EVMtsContract,
  options?: ContractOptions
): ViemContract;
```

- **Details**

`Client.contract` provides a typesafe [viem](https://viem.sh) contract directly from importing your solidity contract.

- **Example**

::: code-group

```ts [example.ts]
import { evmts } from "./evmts";
import { ERC20 } from "./ERC20.sol";

const viemContract = evmts.contract(ERC20);

viemContract.read
  .balanceOf(["0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC"])
  .then((balance) => {
    console.log(balance);
  });
```

```solidity [ERC20.sol]
pragma solidity ^0.8.17;

contract ERC20 {
    ...
}
```

```ts [evmts.ts]
import { forkUrl } from "@evmts/core";
import { createPublicClient } from "viem";
import { optimism } from "viem/chains";

export const publicClient = createPublicClient({
  chain: optimism,
  transport: forkUrl({
    chain: optimism,
    forkUrl: `https://mainnet.optimism.io`,
  }),
});
```

```ts [vite.config.ts]
const { rollupPlugin, foundry } = require("@evmts/plugins");

module.exports = {
  plugins: [
    rollupPlugin({
      plugins: [
        foundry({
          deployments: {
            HelloWorld: {
              10: "0x112234455c3a32fd11230c42e7bccd4a84e02010",
            },
          },
        }),
      ],
    }),
  ],
};
```

:::

### ContractOptions

Optionally pass in contractOptions to override defaults such as the address. Address will default to the deployment address configured via the [Forge plugin](../plugin-reference/forge.md) or [Hardhat plugin](../plugin-reference/hardhat-plugin.md)

- **Type:**

```ts
type ContractOptions = {
  address?: Address;
};
```

- **Live example**

TODO stackblitz

- **See also:** [Viem docs](https://viem.sh/)
