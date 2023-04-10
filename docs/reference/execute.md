# execute()

Executes a script in the clientside vm

- **Type**

```ts
function executeScript(
  script: Script,
  options?: ScriptOptions
): Promise<ScriptResult>;
```

- **Details**

`execute` executes scripts which are written in `.s.sol` files.

These scripts are not sent to an RPC but instead are executed clientside in a fork of a network. This is analogous to executing [forge scripts](https://book.getfoundry.sh/reference/forge/forge-script) from your typescript code.

If any transactions are broadcasted using the `startBroadcast` cheat code the results of all simulated broadcasts are returned with their event logs, gas estimations, and more information. `executionResult.broadcast()` can then be called to send the broadcast on chain.

- **Example**

::: code-group

```ts [example.ts]
import { execute } from "@evmts/core";
import { TransferAllScript } from "./TransferAllScript.s.sol";
import { MyERC20 } from "./MyERC20.sol";
import { walletClient } from "./walletClient";
import { publicClient } from "./publicClient";

const vitalikAddress = publicClient.getEnsAddress({name: normalize('vitalik.eth')})

const simulatedExecution = execute({
  script: TransferAllScript,
  walletClient,
  publicClient,
  args: [MyERC20, vitalikAddress];
})
simulatedExecution.broadcast().then(res => {
  console.log(res.txHash)
})
```

```solidity [TransferAllScript.s.sol]
pragma solidity ^0.8.17;

import {Script} from "forge-std/Script.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TransferAllScript is Script {
    function run(ERC20 contract, address recipient) external {
        address signer = vm.envUint("EVMTS_SIGNER")

        uint256 totalBalance = contract.balanceOf(signer)

        vm.startBroadcast(signer);
        contract.transferFrom(signer, recipient, totalBalance)
        vm.stopBroadcast();
    }
}
```

```ts [walletClient.ts]
import { readContract } from "@evmts/core";
import { httpFork } from "@evmts/core";
import { createWalletClient } from "viem";
import { optimism } from "viem/chains";

export const walletClient = createWalletClient({
  chain: optimism,
  transport: httpFork({
    chain: optimism,
    forkUrl: `https://mainnet.optimism.io`,
    wallet: window.ethereum,
  }),
});
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
            MyERC20: {
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

- **Live example**

TODO stackblitz

- **See also:** [Scripting](/guide/scripting)

## ScriptOptions

- **Type**

```ts
type ScriptOptions = {
  args?: ArgsTuple;
  broadcast?: boolean = false;
  contractAddress?: Address;
  functionName?: string = "run";
  publicClient?: viem.PublicClient;
  script: Contract;
  sender?: Address;
  walletClient?: viem.WalletClient;
};
```

### args

- **Type:** `ArgsTuple`

A tuple of args to pass into the script function call. Defaults to [].

- **Example**

```ts
import { executeScript } from "@evmts/core";
import { optimism } from "viem/chains";
import { ERC20 } from "@evmts/contracts/ERC20";

executeScript(
  ERC20,
  {
    chain: optimism,
  },
  {
    chain: optimism,
    contractAddress: "0x4200000000000000000000000000000000000042",
    functionName: "balanceOf", // [!code focus]
    args: ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"], // [!code focus]
  }
).then((scriptResult) => {
  const balance = scriptResult.value;
  console.log(balance);
});
```

### forkUrl

- **Type:** `UriString`

The url to use to fetch state. It is recomended all production apps set this as if not set it will use the public endpoints which are subject to throttling.

### functionName

- **Type:** `string`

Name of the function to execute. Defaults to `run`.

- **Example**

```ts
import { executeScript } from "@evmts/core";
import { optimism } from "viem/chains";
import { ERC20 } from "@evmts/contracts/ERC20";

executeScript(ERC20, {
  chain: optimism,
  contractAddress: "0x4200000000000000000000000000000000000042",
  functionName: "balanceOf", // [!code focus]
  args: ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"],
}).then((scriptResult) => {
  const balance = scriptResult.value;
  console.log(balance);
});
```

### sender

- **Type:** `Address`

The sending address to use

### walletClient

- **Type:** 'ViemWalletClient'

The [viem wallet client](https://viem.sh/docs/clients/wallet.html) to use for signing tx. Note that broadcast must be set to true for the transaction to actually be sent. By default the transaction is simulated.

- **Example**

```ts
import { createWalletClient, custom } from "viem"; // [!code focus]
import { executeScript } from "@evmts/core";
import { optimism } from "viem/chains";
import { ERC20 } from "@evmts/contracts/ERC20";

const client = createWalletClient({
  // [!code focus]
  chain: optimism, // [!code focus]
  transport: custom(window.ethereum), // [!code focus]
}); // [!code focus]

executeScript(
  ERC20,
  {
    chain: optimism,
  },
  {
    chain: optimism,
    contractAddress: "0x4200000000000000000000000000000000000042",
    functionName: "mint",
    args: [420420],
    broadcast: true,
    walletClient, // [!code focus]
  }
).then((scriptResult) => {
  const balance = scriptResult.value;
  console.log(balance);
});
```

## Script result

# TODO

We want to break this functionality into smaller functions similar to viem

- queries - provider
- mutations - signer
- readContracts - provider + actually a live contract
- writeContracts - signer + actually a live contract

All of these would have a subset of the currently documented functionality depending on the action
