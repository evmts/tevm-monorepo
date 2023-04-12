# ethers.js usage

EVMts is built on top of viem and provides first-class viem support

::: info You will learn

- How to create a viem contract
  :::

# Contracts

EVMts exports a utility `getContract` that will return a [viem contract instance](https://viem.sh/docs/contract/getContract.html) based on the build configuration without needing to pass in an ABI or contract address. This gives viem contracts the same developer experience

This is similar to the developer experience of using the [wagmi cli](https://wagmi.sh/cli/getting-started) but without a code gen step.

The viem contract minimally extends viems contract in the following ways:

- [simulateContract](https://viem.sh/docs/contract/simulateContract.html) now includes an extra property for the events emitted during the simulation
- [estimateContractGas](https://viem.sh/docs/contract/estimateContractGas.html) as well as `simulateContract` will use the local EVM instead of making an RPC request

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

## Try online demo

The following online sandbox example shows how to use EVMts to initiate Viem contract instances

[TODO](https://github.com/evmts/evmts-monorepo/issues/10)

<iframe frameborder="0" width="100%" height="500" src="https://stackblitz.com/edit/github-dluehe-d7t42l?file=README.md"></iframe>

- **See also:** [How plugin works](../how-plugin-works.md)

- **See also:** [Viem Contract Instances](https://viem.sh/docs/contract/getContract.html)
