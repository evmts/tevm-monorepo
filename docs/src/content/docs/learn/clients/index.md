---
title: Tevm clients guide
description: Introduction to clients
---

## Tevm Clients Guide

### Overview

TEVM clients are viem clients configured to use TEVM as their transport option. The onboarding process for using TEVM is straightforward because TEVM leverages viem as its highest-level public API. This minimizes switching costs between TEVM and other tools. Additionally, ethers.js is supported, allowing for broader integration.

### Types of TEVM Clients

- **Client**: A minimal client created with `createClient` from viem, also available in the `tevm` package for convenience. This client is designed to be used with tree-shakable actions for the smallest bundle size footprint. For more information on building your own client, see the [viem custom client documentation](https://viem.sh/docs/clients/custom#build-your-own-client).
- **MemoryClient**: The best way to get started with TEVM. It provides the most convenient setup with all necessary actions preloaded. Ideal if tree-shaking is not a concern, such as when not using TEVM to build a UI.
- **TEVM Transport**: Works with `createPublicClient`, `createWalletClient`, and `createTestClient` from viem. However, it is recommended to use `createMemoryClient` or `createClient` with tree-shakable actions for a better balance between tree-shaking and convenience.

### Quick Start

Check out the [Quick Start](https://stackblitz.com/~/github.com/evmts/quick-start?file=README.md) to get up and running with TEVM clients quickly.

### Viem Client Introduction

For more detailed information on viem clients and transports, see the [viem client documentation](https://viem.sh/docs/clients/intro).

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

const client = createClient({
  transport: createTevmTransport({
    fork: { transport: http("https://mainnet.optimism.io")({}) },
  }),
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

### MemoryClient: Batteries Included

If tree-shaking is not a concern, the `MemoryClient` provides the easiest setup with all necessary actions preloaded.

```typescript
import { createMemoryClient } from "tevm";
import { http } from "viem";

const memoryClient = createMemoryClient({
  fork: { transport: http("https://mainnet.optimism.io")({}) },
});

memoryClient.getBlockNumber().then(console.log);
memoryClient
  .tevmSetAccount({ address: `0x${"69".repeat(20)}`, balance: "0xffffffffff" })
  .then(console.log);
```

### Forking a Network

Viem clients themselves are EIP-1193 providers and can be used as the fork transport. These options are available for both `createMemoryClient` and `createTevmTransport`. Once you fork, the forked block is saved under block tag `fork`, and any blocks mined higher than the forked block will not be included in the forked chain.

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

For most of Tevm functionality to work, the forked network must support the following JSON-RPC methods:

- eth_blockNumber
- eth_getStorageAt
- eth_getProof
- eth_getBlockByNumber
- eth_getCode

Nearly all nodes do support these methods so using Tevm is a good way to get access to other methods like eth_debugTraceTransaction if your RPC node otherwise doesn't support it. Just fork the RPC node with tevm and execute the RPC method locally.

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

With TEVM, you can fork the chain and optimistically see what the chain looks like after a transaction is mined without needing to wait. This allows for instant feedback and testing in a simulated environment.

```typescript
import { createMemoryClient, tevmSetAccount, tevmMine } from "tevm";

const client = createMemoryClient();
await tevmSetAccount(client, {
  address: `0x${"69".repeat(20)}`,
  balance: "0xffffffffff",
});
await tevmMine(client, { blockCount: 1 });

// Check the updated state
client.getBlockNumber().then(console.log);
```

### Mining Modes

TEVM supports two mining modes:

- **Manual**: Using `tevm.mine()`
- **Auto**: Automatically mines a block after every transaction.

TEVM state does not update until blocks are mined.

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

### Network Support

TEVM guarantees support for the following networks:

- Ethereum mainnet
- Standard OP Stack chains

More official chain support will be added in the near future. Currently, Optimism deposit transactions are not supported but will be in a future release.

### Network and Hardfork Support

TEVM supports enabling and disabling different EIPs, but the following EIPs are always turned on:

- 1559
- 4895
- 4844
- 4788

Currently, only EIP-1559 Fee Market transactions are supported.

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

MemoryClient supports the following viem actions:

- [TEVM actions API](https://tevm.sh/reference/tevm/memory-client/type-aliases/tevmactions/)
- [Viem public actions API](https://viem.sh/docs/actions/public/introduction)
- [Test actions](https://viem.sh/docs/actions/test/introduction

)

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
