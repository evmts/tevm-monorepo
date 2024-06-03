---
title: Tevm clients guide
description: Introduction to clients
---

## Tevm Clients

Tevm clients provide a JavaScript api for interacting with the Tevm API. This api provides a uniform API for interacting with Tevm whether interacting with a [MemoryClient](/reference/tevm/memory-client/type-aliases/memoryclient) directly or remotely interacting via an [HttpCLient](/reference/tevm/http-client/type-aliases/httpclient). Tevm clients share the same [actions](/learn/actions) based interface along with a [`request`](/reference/tevm/client-types/type-aliases/tevmclient#request) method for handling JSON-RPC requests.

The following in-memory clients are available

- [MemoryClient](/reference/tevm/memory-client/type-aliases/memoryclient) - An in memory instance of the EVM that can run in Node.js, bun or the browser
- [TevmProvider](https://tevm.sh/reference/tevm/ethers/classes/tevmprovider/) - For ethers users

## Quick start

A cli scaffolding tool will be available soon

![A rocketship in space](../../../../assets/cli.gif)

:::tip[In a hurry?]
The final result of this tutorial is available to try in your browser as a [StackBlitz](https://stackblitz.com/~/github.com/evmts/quick-start?file=src/main.ts)
:::

## Viem API

Tevm is built on top of viem and supports an ever-growing list of the viem API. 100% support for viem is release criteria for Tevm `1.0.0` stable.

## MemoryClient

The default client most folks will want to use is `MemoryClient`. It comes with the following additional functionality added to the `BaseClient`

- `tevmSend` - This decorator allows issuing JSON-RPC requests. This includes `send` and `sendBulk` methods.
- `requestEip1993` - this adds an EIP-1993 compatable `request` method to the client
- `eip1993EventEmitter` - This adds an EIP-1993 compatable event emitter API to the tevm client
- `tevmActions` this adds the core api for tevm such as `getAccount`, `call`, `script`, and more described more in detail in the `actions` section of the learn docs
- `ethActions` this adds actions that correspond to the standard ethereum JSON-RPC api such as `eth.blockNumber`, `eth.getStorageAt`, `eth.balanceOf` and more.

To create a memoryclient simply initialize it with `createMemoryClient`.

```typescript
import { createMemoryClient } from "tevm";

const client = createMemoryClient({
  fork: { transport: http("https://mainnet.optimism.io")({}) },
});
```

## Options

Notable options include:

- fork.transport to fork a network with any eip-1193 provider
- fork.blockTag to specify a specific block tag to fork
- loggingLevel defaults to warning. Setting to `debug` will show a significant amount of internal logs and `trace` includes the EVM logs

It is recomended you also pass in a `chain` object when forking. This will improve the performance of forking as well as guarantee tevm has all the correct chain information such as which EIPs and hardforks to use. A TevmChain is different from a viem chain in that it extends viem chains with the `ethereumjs/common` interface.

See [BaseClientOptions](https://tevm.sh/reference/tevm/base-client/type-aliases/baseclientoptions/) docs for information about all individual options.

## Forking a client with another client

`MemoryClient` is itself an `EIP-1193` provider. This means tevm clients can fork other tevm clients.

```typescript
const originalClient = createMemoryClient();

await doStuff(originalClient);

const forkedClient = createMemoryClient({
  fork: { transport: originalClient },
});
```

## Mining modes

Currently only manual mining using [tevm.mine()](https://tevm.sh/reference/tevm/actions-types/type-aliases/minehandler/#_top) is supported.

:::tip[Tevm state does not update until blocks are mined]
By default calls are executed against the cannonical head. This means if you have unmined tx, the call will initially not be aware of them. This can cause issues if creating addresses with CREATE2 from the nonce not changing or unexpected issue of expecting state to be updated.

For example, if you send a mint tx, balanceOf will not reflect this tx unless 1 of the following is true:

- the `balanceOf` sets block tag to `pending`. This tells tevm to run the tx on top of the pending block
- the tx is explicitly mined with `tevm.mine()`
- tevm client is set to `auto` mining mode such that every tx is mined.
  :::

## Using tevm over http

A common use case is wanting to use a client over http. This can be done via using [@tevm/server](https://tevm.sh/reference/tevm/server/globals/) to run tevm as an HTTP server.

```typescript
import { createServer } from "tevm/server";
import { createMemoryClient } from "tevm";

const memoryClient = createMemoryClient();

const server = createServer({
  request: tevm.request,
});

server.listen(8545, () => console.log("listening on 8545"));
```

Once you are running it as a server you can use any ethereum client to communicate with it with no special modifications including a [viem public client](https://viem.sh/docs/clients/public.html)

```typescript
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http("https://localhost:8545"),
});

console.log(await publicClient.getChainId());
```

Tevm also supports a growing list of the [anvil/hardhat test api](https://viem.sh/docs/clients/test#test-client).

For viem users you can also use the custom tevm actions such as `tevmSetAccount` even over http via extending any viem client with [tevmViemExtension](https://tevm.sh/reference/tevm/viem/functions/tevmviemextension/).

```typescript
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { tevmViemExtension } from "tevm/viem";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http("https://localhost:8545"),
}).extend(tevmViemExtension());

console.log(await publicClient.setAccount({ address: `0x${"00".repeat(20)}` }));
console.log(await publicClient.getAccount({ address: `0x${"00".repeat(20)}` }));
```

This works because all tevm actions are implemented both in memory and as JSON-RPC handlers. This means whether using tevm in memory with `MemoryProvider` or over http the api is the same.

### State persistence (experimental)

It is possible to persist the tevm client to a syncronous source using the `persister` option. This will initialize the state with with the persisted storage if it exists and back up the state to this storage after state updates happen.

- Note that `proxy mode` invalidates the cache every block so there isn't much gained from persisting state in proxy mode
- There is currently a known bug where `fork mode` will not persist the block tag and thus will be fetching state from a newer block when reinitialized.
- The memory client still keeps the state in memory as source of truth even with state persistence. It is simply backing up the state to storage so it can rehydrate itself on future initializations

```typescript
import { createMemoryClient, createSyncPersister } from "tevm";
import { createMemoryClient } from "tevm/sync-storage-persister";

// Client state will be hydrated and persisted from/to local storage
const clientWithLocalStoragePersistence = createMemoryClient({
  persister: createSyncPersister({
    storage: localStorage,
  }),
});
```

## Network support

Tevm network compatability will grow over time. Check back here for updates. At this moment tevm guarantees support for the following networks:

- Ethereum mainnet
- Standard OP Stack chains

Other EVM chains are likely to work but do not officially carry support.

Note: At this time [Optimism deposit transactions](https://docs.optimism.io/stack/protocol/rollup/deposit-flow) are not supported by At this time [Optimism deposit transactions](https://docs.optimism.io/stack/protocol/rollup/deposit-flow) are not supported by tevm but will be in a future release. Currently Tevm filters out these tx from blocks.

## Network and hardfork support and tx support

Tevm experimentally supports enabling and disabling different EIPs but the following EIPs are always turned on.

- 1559
- 4895,
- 4844,
- 4788

Tevm plans on supporting many types of tx in future but at this moment only [EIP-1559 Fee Market tx](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip1559Transaction.ts) are supported.

## Tree shakeable actions

Like viem, Tevm supports tree-shakeable action. With `createBaseClient()` and the `tevm/actions` package. These are described in detail in the [actions api guide](../actions/index.md)
