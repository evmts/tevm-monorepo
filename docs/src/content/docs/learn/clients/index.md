---
title: Tevm clients guide
description: Introduction to clients and actions
---

## Tevm Clients

Note: this guide is out of date and will be updated soon

Tevm clients provide a JavaScript api for interacting with the Tevm API. This api provides a uniform API for interacting with Tevm whether interacting with a [MemoryClient](/reference/tevm/memory-client/type-aliases/memoryclient) directly or remotely interacting via an [HttpCLient](/reference/tevm/http-client/type-aliases/httpclient). Tevm clients share the same [actions](/learn/actions) based interface along with a [`request`](/reference/tevm/client-types/type-aliases/tevmclient#request) method for handling JSON-RPC requests.

The following clients are available

- [MemoryClient](/reference/tevm/memory-client/type-aliases/memoryclient) - An in memory instance of the EVM that can run in Node.js, bun or the browser
- [HttpClient](/reference/tevm/http-client/type-aliases/httpclient) - A client that talks to a remote `MemoryClient` running in an [http server](/reference/tevm/server/api)
- [Viem extensions](/reference/tevm/viem/api) - Provides a viem based client instance and some experimental optimistic updating apis.
- 🚧 Under construction [Ethers extensions](/reference/tevm/ethers/api) - An ethers based memory client and http client
- 🚧 Under construction `WebsocketClient` - A web socket based TevmClient similar to the `HttpClient`

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
  fork: { url: "https://mainnet.optimism.io" },
});
```

## Browser usage

The `MemoryClient` runs in the browser but may require [top-level-await](https://github.com/Menci/vite-plugin-top-level-await) support to be added to your JavaScript build tool. It's also possible you need some node-polyfills.

If using vite see [the vite example](https://github.com/evmts/tevm-monorepo/blob/main/examples/vite/vite.config.ts) for reference. Examples for other bundlers are coming soon.

## Actions

The main interface for interacting with any Tevm client is it's `actions api`. See [actions api](/learn/actions) guide or the [TevmClient reference](/reference/tevm/client-types/type-aliases/tevmclient) for more information.

## Procedures

Tevm also has an `client.request` method for doing JSON procedure calls. For `MemoryClient` this procedure call happens in memory and for `HttpClient` this procedure call is resolved remotely using JSON-RPC (json remote procedure call). For more information see the [JSON-RPC](/learn/json-rpc) docs and the [`client.request`](/reference/tevm/procedures-types/type-aliases/tevmjsonrpcrequesthandler) generated reference docs.

## Modes

The underlying [Tevm MemoryClient](/reference/tevm/memory-client/type-aliases/memoryclient) can run in three different modes

### Normal mode

In normal mode the Tevm client initializes a new empty EVM instance in memory. It will have a chainId of 420 and start from block 0.

If you want to add any contracts to your normal clients the NormalMode supports the `predeploy` and `precompile` options as do all modes. You can also use `client.setAccount` to manually add bytecode to a contract address.

```typescript
import { createMemoryClient } from "tevm";

const memoryClient = createMemoryClient();
console.log(memoryClient.mode); // normal
console.log(await memoryClient.eth.blockNumber()); // 0n
```

### Fork mode

Fork mode will fork a chain at a given block number defaulting to the latest block number when given an RPC url and an optional block tag. When you fork the chain all state is cached. No future changes in future blocks will be included in this forked chain. This mode is analogous to what happens with anvil if you use a forkUrl

Fork mode is initialized by setting the `fork` property in `createMemoryClient`

```typescript
import { createMemoryClient } from 'tevm'

const memoryClient = createMemoryClient({
  fork: {
    url: 'https://mainnet.optimism.io'
  }
})
console.log(memoryClient.mode) // forked
console.log(await memoryClient.eth.blockNumber()) // returns optimism block number at time of fork unless future actions simulate mining a new block
console.log(await memoryClient.eth.getStorageAt(...)) // Storage is always read from cache or fetched from the forked block
```

### Proxy mode

Proxy mode is similar to ForkMode but always tracks latest block instead of forking. It will temporarily fork the chain for 2 seconds at a time. But if the cache is more than 2 seconds old the state manager will first check to see if the blockNumber has changed. If it does change it invalidates the cache,

Proxy mode is initialized by setting the `proxy` option in `createMemoryClient`

The `expectedBlockTime` property will configure how long the client waits before starting to check if block changed. It can be set arbitrarily large if you simply want to cache state for that period of time.

```typescript
import { createMemoryClient } from 'tevm'

const memoryClient = createMemoryClient({
  proxy: {
    url: 'https://mainnet.optimism.io'
    // optionally configure the expected block time in milliseconds
    // defaults to 2_000 (2s)
    expectedBlockTime: 10_000,
  }
})
console.log(memoryClient.mode) // proxy
console.log(await memoryClient.eth.blockNumber()) // will return latest block number
```

### Differences between forked and proxy mode

Fork and proxy mode are very similar with the only difference being how they handle cache invalidation. Fork mode forks the chain at a very specific block height and will never invalidate the cache. Proxy mode attempts to invalidate the cache whenever new blocks come in.

It is always suggested to use forked mode if you can get away with it.

- Forked mode is much more RPC efficient via never invalidating the cache
- Proxy mode works best if you expect external changes to the chain to potentially change the expected results of your contract calls
- If you want a bit of both you can use proxy mode with a large expectedBlockTime to invalidate the cache infrequently

### State persistence

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

## BaseClient and decorators

The `BaseClient` is the lowest level client. Additional functionality can be added via `client decorators`. Client decorators follow the same [viem decorator pattern](https://viem.sh/docs/clients/custom) which allows you to add additional functionality to the base client using the `extend` method. You can even write your own extensions.

```typescript
import { createBaseClient } from "tevm/base-client";
import {
  tevmSend,
  eip1993EventEmitter,
  requestEip1193,
  ethActions,
  tevmActions,
} from "tevm/decorators";

const client = createBaseClient({
  fork: { url: "https://mainnet.optimism.io" },
})
  .extend(tevmSend())
  .extend(eip1993EventEmitter())
  .extend(requestEip1193())
  .extend(ethActions())
  .extend(tevmActions());
```

The above code creates a client that is exactly the same as the `MemoryClient`.

The baseClient by itself contains no functionality beyond just the low level `getVm` property to get the internal vm instance and some other low level properties. If optimizing code splitting it can be a good choice however being used with specific decorators or being used with the low level `actions` implementations from the `tevm/actions` package. For most users however, we recomend using `memoryclient` unless you have a good reason for not doing so.
