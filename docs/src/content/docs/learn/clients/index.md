---
title: Tevm clients guide
description: Introduction to clients
---

## Tevm Clients Guide

### Overview

TEVM clients are [viem clients](https://viem.sh) configured to use TEVM as their underlying ethereum node. The onboarding process for using TEVM is straightforward because TEVM leverages viem as its highest-level public API. This minimizes switching costs between TEVM and other tools. Additionally, ethers.js is supported, allowing for broader integration.

### Types of TEVM Clients

- **MemoryClient**: The best way to get started with TEVM. It provides the most convenient setup with all necessary actions preloaded. Ideal if tree-shaking is not a concern, such as when not using TEVM to build a UI.
- **Client**: A minimal client created with `createClient` from viem, also available in the `tevm` package for convenience. This client is designed to be used with tree-shakable actions for the smallest bundle size footprint. For more information on building your own client, see the [viem custom client documentation](https://viem.sh/docs/clients/custom#build-your-own-client).
- **PublicClient**: A special viem client that conveniently comes with viem actions.
- **TEVM Transport**: The TevmTransport is a special version of the tevmClient that is used to give a viem client made with `createClient`, `createPublicClient`, `createWalletClient`, or `createTestClient` tevm as it's underlying node.

:::tip[When to use which client]

- Use `createMemoryClient` if tree shaking is not a concern as it is is the most convenient and easiest client to use
- If building a frontend UI it is recomended to use `createClient` for a more minimal client and then use tree shakable actions.

Of course if you prefer the ergonomics of tree shakable actions go ahead and use the tree shakable api even if tree shaking is not a concern
:::

### Quick Start

Check out and fork the [Quick Start](https://stackblitz.com/~/github.com/evmts/quick-start?file=README.md) to get up and running with TEVM clients quickly.

### Viem Client Introduction

For more detailed information on viem clients and transports, see the [viem client documentation](https://viem.sh/docs/clients/intro).

### Creating a Client

If tree-shaking is not a concern, the `MemoryClient` provides the easiest setup with all necessary actions preloaded.

Note: All tevm options are also available on `createTevmTransport` when using tree shakable api

````typescript
import {createMemoryClient} from 'tevm'

// NOTE: All options are optional
export const memoryClient = createMemoryClient({
    /**
     * The common used of the blockchain. Defaults to tevmDevnet. Required if you want chain specific features like l1 gas fee for op chains
     * If not specified and a fork is provided the common chainId will be fetched from the fork
     * Highly recomended you always set this in fork mode as it will speed up client creation via not having to fetch the chain info
     * common can be imported from `tevm/common` e.g. `import {optimism} from 'tevm/common'`. They can also be created using `createCommon`
     */
    readonly common?: TCommon;
    /**
     * Configure logging options for the client. Defaults to 'warn'
     */
    readonly loggingLevel?: LogOptions['level'];
    /**
     * The configuration for mining. Defaults to 'auto'
     * - 'auto' will mine a block on every transaction
     * - 'interval' will mine a block every `interval` milliseconds
     * - 'manual' will not mine a block automatically and requires a manual call to `mineBlock`
     */
    readonly miningConfig?: MiningConfig;
    /**
     * Custom precompiles allow you to run arbitrary JavaScript code in the EVM.
     * See the the advanced scripting guide for more info
     */
    readonly customPrecompiles?: CustomPrecompile[];
    /**
     * Custom predeploys allow you to deploy arbitrary EVM bytecode to an address.
     * This is a convenience method and equivalent to calling tevm.setAccount() manually
     * to set the contract code.
     */
    readonly customPredeploys?: ReadonlyArray<Predeploy<any, any>>;
    /**
     * Enable/disable unlimited contract size. Defaults to false.
     * If set to true you may still run up against block limits
     */
    readonly allowUnlimitedContractSize?: boolean;
    /**
     * The memory client can optionally initialize and persist it's state to an external source like local storage
     * using `createSyncPersister`. Currently only evm state is persisted and not block info
     * @example
     * ```typescript
     * import { createMemoryClient, createSyncPersister } from 'tevm'
     *
     * const persister = createSyncPersister({
     *   storage: {
     *     getItem: (key: string) => localStorage.getItem(key),
     *     setItem: (key: string, value: string) => localStorage.setItem(key, value),
     *   }
     * })
     *
     * const memoryClient = createMemoryClient({ persister })
     * ```
     */
    readonly persister?: SyncStoragePersister;
    // ***VIEM OPTIONS***
    name: 'MyClient',
    account: viemAccount,
    pollingInterval: 0,
    cacheTime: 0,
})
````

### Creating a TEVM Client with Tree-Shakable Actions

Tree-shakable actions allow you to import only the parts of the library you need, optimizing bundle size for frontend applications. This approach is recommended for most users, especially when building UIs.

```typescript
import {
  createClient,
  http,
  publicActions,
  testActions,
  walletActions,
} from "viem";
import { tevmViemActions, createTevmTransport } from "tevm";
import { optimism } from "tevm/common";

// createTevmTransport takes the same actions as createMemoryClient
const transport = createTevmTransport({
  fork: { transport: http("https://mainnet.optimism.io")({}) },
})

const client = createClient({
  transport: ,
  chain: optimism,
});

// Explanation of createTevmTransport
// `createTevmTransport` integrates an in-memory Ethereum client, ideal for local-first applications, optimistic updates, and advanced TEVM functionalities like scripting.
// It configures a custom TEVM transport for viem clients, making them capable of handling TEVM-specific actions and state.

import { getChainId } from "viem/actions";
getChainId(client).then(console.log);

import { tevmSetAccount } from "tevm/actions";
tevmSetAccount(client, {
  address: `0x${"69".repeat(20)}`,
  balance: "0xffffffffff",
}).then(console.log);
```

### Forking a Network with fork Transport

Tevm can fork a network via being provided an [transport](https://viem.sh/docs/clients/transports/http) with an [EIP-1193 compatabile request function](https://eips.ethereum.org/EIPS/eip-1193).

```typescript
import { createMemoryClient, http } from "tevm";
import { optimism } from "tevm/common";

const client = createMemoryClient({
  // fork optimism at blockNumber 420n
  fork: { transport: http("https://mainnet.optimism.io")(), blockTag: 420n },
  common: optimism,
});

console.log(await client.getBlockNumber()); // 420n
```

For most of Tevm functionality to work, the forked network must support the following JSON-RPC methods:

- eth_blockNumber
- eth_getStorageAt
- eth_getProof
- eth_getBlockByNumber
- eth_getCode

Nearly all nodes do support these methods so using Tevm is a good way to get access to other methods like eth_debugTraceTransaction if your RPC node otherwise doesn't support it. Just fork the RPC node with tevm and execute the RPC method locally.

### Forking another client

Any client with an EIP-1559 `request` function works so this includes all viem clients, and all tevm clients and more.

Forking your own clients could be useful depending on use case:

```typescript
import { createMemoryClient, http } from "tevm";
import { optimism } from "tevm/common";

const originalClient = createMemoryClient();
await originalClient.tevmSetAccount({
  address: `0x${"69".repeat(20)}`,
  balance: "0xffffffffff",
});

const forkedClient = createMemoryClient({
  fork: { transport: originalClient },
  common: optimism,
});

forkedClient.getBlockNumber().then(console.log);
```

### Deep Copying a client

For the vast majority of use cases you will want to fork rather than clone because forking is much more performant. But if your use case requires it such as needing to copy the mempool you can also `deepCopy()` clients.

```typescript
import { createMemoryClient } from "tevm";

const client = createMemoryClient();

const copy = await client.deepCopy();
```

### Use Cases

#### 1. Using TEVM to Share Logic Between Contracts and Frontend

TEVM allows you to reuse on-chain encoding logic on the frontend. For example, if you have encoding logic in a library on-chain, you can wrap that library in a Solidity function, import the TEVM contract directly from Solidity into JavaScript, and reuse that logic on the frontend.

#### 2. Using TEVM for Testing

TEVM can be used as a testing devnet alternative to tools like Anvil or Hardhat. The TEVM API makes it extremely powerful to work with and customize. For instance, you can simulate complex contract interactions and validate the outcomes before deploying on the mainnet.

```typescript
import { createMemoryClient, tevmSetAccount } from "tevm";
import { testActions } from "viem/actions";

const client = createMemoryClient();
await tevmSetAccount(client, {
  address: `0x${"69".repeat(20)}`,
  balance: "0xffffffffff",
});

// Test Actions
import { mine } from "viem/actions";
await mine(client);
```

#### 3. Using TEVM for Optimistic Updates

In order to use Tevm for optimistic updates we can take advantage of the `pending` block tag. Any action or json-rpc request.

To do this we simply do not mine any blocks and allow the transactions to stay in the pending pool.

```typescript
import { sendRawTransactoin, call } from "viem";
import { client } from "./tevmClient.js";

const txHash = await sendRawTransaction(client, rawTxParams);

const cannonicalResult = await call(client, {
  ...callParams,
  blockTag: "latest",
});
const optimisticResult = await call(client, {
  ...callParams,
  blockTag: "pending",
});
```

We can remove tx from the pending tx pool as follows

```typescript
const txPool = await client.transport.tevm.getTxPool();

txPool.removeByHash(txHash);
```

Note: Tevm currently does not watch for new blocks from the network. This can be done today using `vm.runBlock` on new blocks but will not be as efficient as future abstractions.
Abstractions to do this are under construction and will be in a future release.

### Mining Modes

TEVM supports two mining modes:

- **Manual**: Using `tevm.mine()`
- **Auto**: Automatically mines a block after every transaction.

TEVM state does not update until blocks are mined.

The following mining modes are planned to be added in future. Consider joining telegram if you have a use case that needs these mining modes now
and we can help with workarounds in meantime and prioritize adding them sooner.

- **Sync**: In this mode manually mined blocks are rebased on top of the forked chain as the network mines new blocks
- **Gas**: In this mode blocks are mined whenever the block is full
- **Interval**: In this mode blocks are mined on a time interval defaulting to 2s

### Using TEVM Over HTTP

TEVM can be run as an HTTP server using `@tevm/server` to handle JSON-RPC requests.

```typescript
import { createServer } from "tevm/server";
import { createMemoryClient } from "tevm";

const memoryClient = createMemoryClient();

const server = createServer({
  request: memoryClient.request,
});

server.listen(8545, () => console.log("listening on 8545"));
```

This setup allows you to use any Ethereum client to communicate with it, including a viem public client.

```typescript
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http("https://localhost:8545"),
});

publicClient.getChainId().then(console.log);
```

### State Persistence (Experimental)

TEVM clients can persist their state to a synchronous source using the `persister` option. This allows the client to rehydrate itself from persisted storage upon initialization.

```typescript
import { createMemoryClient, createSyncPersister } from "tevm";

const clientWithLocalStoragePersistence = createMemoryClient({
  persister: createSyncPersister({
    storage: localStorage,
  }),
});
```

This experimental feature does not have a stable api and could change in future.

### Network Support

TEVM guarantees support for the following networks:

- Ethereum mainnet
- Standard OP Stack chains

More official chain support will be added in the near future. Currently, Optimism deposit transactions are not supported but will be in a future release.

Consider joining telegram if you want your network to be added to this list.

### Network and Hardfork Support

Tevm currently only supports hardforks >=cancun. If you need support for other hardforks ethereumjs has support for all hardforks though is missing many features tevm has. Join telegram if you need help.

TEVM supports enabling and disabling different EIPs, but the following EIPs are always turned on:

- 1559
- 4895
- 4844
- 4788

Currently, only EIP-1559 Fee Market transactions are supported.

The following EIPs are supported by the underlying EVM

1153, 1559, 2315, 2565, 2718, 2929, 2930, 2935, 3074, 3198, 3529, 3540, 3541, 3607, 3651,
3670, 3855, 3860, 4399, 4895, 4788, 4844, 5133, 5656, 6780, 6800, 7516,

### Composing with TEVM Contracts and Bundler

MemoryClient can compose with TEVM contracts and the TEVM bundler. For more information, see the [TEVM contracts guide](https://tevm.sh/learn/contracts/) and the [TEVM Solidity imports guide](https://tevm.sh/learn/solidity-imports/).

```typescript
import { createMemoryClient } from "tevm";
import { MyERC721 } from "./MyERC721.sol";
import { http } from "viem";

const tevm = createMemoryClient({
  fork: {
    transport: http("https://mainnet.optimism.io")({}),
  },
});

const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

tevm.runContractCall(MyERC721.write.mint({ caller: address })).then(() => {
  tevm
    .runContractCall(MyERC721.read.balanceOf({ caller: address }))
    .then((balance) => {
      console.log(balance); // 1n
    });
});
```

### Actions API

Memory client supports all viem actions along with special tevm specific actions.
We are still in process of adding complete testing to the viem api so open an issue if you find any bugs.

### Recommended Reading

- [Client Guide](https://tevm.sh/learn/clients/)
- [Actions Guide](https://tevm.sh/learn/actions/)
- [JSON-RPC Guide](https://tevm.sh/learn/json-rpc/)
- [Reference Docs](https://tevm.sh/reference/tevm/memory-client/functions/creatememoryclient/)
- For more information on viem clients, see the [viem client docs](https://viem.sh/docs/clients/introduction)

### Viem Client Types

- **Public Client**: Provides access to Public Actions such as `getBlockNumber` and `getBalance`.
- **Wallet Client**: Provides access to Wallet Actions such as `sendTransaction` and `signMessage`.
- **Test Client**: Provides access to Test Actions such as `mine` and `impersonate`.
- **TEVM Client**: Provides access to custom TEVM-specific functionality such as account impersonation and advanced actions for working with accounts.

### Public Actions

Public Actions map one-to-one with "public" Ethereum RPC methods (e.g., `eth_blockNumber`, `eth_getBalance`). They do not require special permissions and are used with a Public Client.

### Wallet Actions

Wallet Actions map one-to-one with "wallet" or "signable" Ethereum RPC methods (e.g., `eth_requestAccounts`, `eth_sendTransaction`). They require special permissions and are used with a Wallet Client.

### Test Actions

Test Actions map one-to-one with "test" Ethereum RPC methods (e.g., `evm_mine`, `anvil_setBalance`). They are used for testing and simulation purposes with a Test Client.

### TEVM Actions

TEVM Actions provide powerful low-level functionality for interacting with the EVM, such as executing calls, deploying contracts, and manipulating account states. They extend the capabilities of standard viem actions with additional features specific to TEVM.

By following this guide, you can effectively utilize TEVM clients to interact with the Ethereum blockchain, optimize your development workflow, and leverage the full capabilities of the TEVM and viem ecosystems.
