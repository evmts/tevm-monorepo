# executeScript()

Executes a script.

- **Type**

```ts
function executeScript(
  script: Script,
  options?: ScriptOptions
): Promise<ScriptResult>;
```

- **Details**

The first argument is a Script object. The second object has options. The options should be familiar if you are used to using forge scripts.

- **Example**

```ts
import { executeScript } from "@evmts/core";
import { HelloWorld } from "./HelloWorld.s.sol";

executeScript(HelloWorld).then((scriptResult) => {
  console.log(scriptResult.value);
});
```

- **Live example**

TODO stackblitz

- **See also:** [Scripting](/guide/scripting)

## ScriptOptions

- **Type**

```ts
type ScriptOptions = {
  args?: ArgsTuple;
  broadcast?: boolean = false;
  chain?: ViemChain;
  contractAddress?: Address;
  forkBlockNumber?: number;
  forkUrl?: string;
  functionName?: string = "run";
  sender?: Address;
  walletClient?: ViemWalletClient;
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

### broadcast

- **Type:** `Boolean`

Whether to broadcast any transactions. Defaults to `false`

- **See also:** [Broadcasting transactions](/guide/broadcasting-transactions)

### chain

- **Type:** `ViemChain`

The chain object.

- **Example**

```ts
import { executeScript } from "@evmts/core";
import { optimism } from "viem/chains"; // [!code  focus]
import { MyScript } from "./MyScript.s.sol";

executeScript(MyScript, {
  chain: optimism, // [!code focus]
}).then((scriptResult) => {
  console.log(scriptResult.value);
});
```

### forkBlockNumber

- **Type:** `number`

Fetch state from a specific block number over the remote endpoint specified by forkUrl

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
