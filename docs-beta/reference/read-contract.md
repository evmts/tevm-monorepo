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

evmts.read(
  ERC20.balanceOf("0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC")
)
  .then((balance) => {
    console.log(balance);
  });
```

```solidity [ERC20.sol]
pragma solidity ^0.8.17;

contract ERC20 {
    ...
}

function balanceOf (...args: ABITypeMagic<abi>) {
  return {
    args,
    addressMap: {
      10: '0x4200000000000000000000000000000000000042'
    },
    abi: [{
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
    }]
  }
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
const { rollupPluginEvmts, foundry } = require("@evmts/plugins");

module.exports = {
  plugins: [
    rollupPluginEvmts({
          deployments: {
            HelloWorld: {
              10: "0x112234455c3a32fd11230c42e7bccd4a84e02010",
            },
          }
    })
  ],
};
```

:::

### ContractOptions

TODO

- **Type:**

```ts
type ContractOptions = {
  address?: Address;
};
```

- **Live example**

TODO stackblitz

- **See also:** [Viem docs](https://viem.sh/)
