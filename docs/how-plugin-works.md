# How plugin works

The evmts plugin allows developers to directly import solidity files and forge scripts in their typescript code

```typescript
import MyERC20 from "./MyERC20.sol";
import { readContract } from "@evmts/core";

const balance = await readContract(MyERC20.balanceOf, ["vitalik.eth"]);
```

In this page you will learn

- What the plugin is doing conceptually

For a more in depth technical breakdown see the [developer docs](./developer.md)

## Conceptual

When the plugin sees a solidity import it will resolve the abi and the bytecode based on the plugin setup

Before transformation

```typescript
import { MyScript } from "./MyScript.sol";
```

After transformation

```typescript
// MyScript.sol.ts
const { MyScript } = {
  MyScript: {
    version,
    _artifactPath,
    _contractPath,
    name,
    abi,
    bytecode,
  },
};
```

The typescript can then go ahead and use the artifacts however it pleases including in third party libraries like [Viem](https://todoviem) or [ethers](https://todoethers)

@evmts/core as a standard has an API where you pass around the entire contract address so the developer never needs to think about the abi or bytecode and both melt away as a implementation detail of the library.

## Details

## There are 4 core concepts to understand

## Plugin configuration

Under the hood evmts is using a lightly modified version of the [wagmi cli](https://wagmi.sh/cli/getting-started). It works with many projects with no additional configuration but can be custom configured via the [foundry plugin](https://wagmi.sh/cli/plugins/foundry) and the [hardhat plugin](https://wagmi.sh/cli/plugins/hardhat).

These configurations tell evmts how to compile contracts using the build tool of choice. If no configuration is provided it
