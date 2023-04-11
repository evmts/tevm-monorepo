# ethers.js usage

EVMts is built on top of viem and provides first-class viem support

::: info You will learn

- How to create a viem contract
- TODO
  :::

- **Example**

::: code-group

```ts [example.ts]
import { getContract } from "viem";
import { optimism } from "viem/chains";
import { publicClient } from "./publicClient";
import { HelloWorld } from "./HelloWorld.sol";

const viemContract = getContract({
  address: HelloWorld.deployments[optimism.id].contractAddress,
  abi: HelloWorld.abi,
  publicClient,
});
```

```solidity [HelloWorld.sol]
pragma solidity ^0.8.17;

contract HelloWorld {
    string public greet = "Hello World!";
}
```

```ts [publicClient.ts]
import { httpFork } from "@evmts/core";
import { createPublicClient } from "viem";
import { optimism } from "viem/chains";

export const publicClient = createPublicClient({
  chain: optimism,
  transport: httpFork({
    chain: optimism,
    forkUrl: `https://mainnet.optimism.io`,
  }),
});
```

```ts [vite.config.ts]
const { rollupPlugin, foundry } = require("@evmts/plugin");

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

- **See also:** [How plugin works](../how-plugin-works.md)

- **See also:** [Viem Contract Instances](https://viem.sh/docs/contract/getContract.html)
