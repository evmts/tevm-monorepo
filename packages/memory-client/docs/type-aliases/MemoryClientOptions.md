[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / MemoryClientOptions

# Type Alias: MemoryClientOptions\<TCommon, TAccountOrAddress, TRpcSchema\>

> **MemoryClientOptions**\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>: `TevmNodeOptions`\<`TCommon`\> & `Pick`\<`ClientConfig`\<`Transport`, `TCommon`, `TAccountOrAddress`, `TRpcSchema`\>, `"type"` \| `"key"` \| `"name"` \| `"account"` \| `"pollingInterval"` \| `"cacheTime"`\>

Defined in: [packages/memory-client/src/MemoryClientOptions.ts:79](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/MemoryClientOptions.ts#L79)

Configuration options for creating a [MemoryClient](MemoryClient.md).

This type extends `TevmNodeOptions` and includes specific options for configuring the MemoryClient,
such as the transport type, account, polling interval, and caching behavior. It provides
a comprehensive set of parameters to customize the behavior of the in-memory Ethereum client.

## Type Parameters

• **TCommon** *extends* `Common` & `Chain` = `Common` & `Chain`

The common chain configuration, extending both `Common` and `Chain`.

• **TAccountOrAddress** *extends* `Account` \| `Address` \| `undefined` = `undefined`

The account or address type for the client.

• **TRpcSchema** *extends* `RpcSchema` \| `undefined` = [`TevmRpcSchema`](TevmRpcSchema.md)

The RPC schema type, defaults to `TevmRpcSchema`.

## Example

```typescript
import { createMemoryClient, http, type MemoryClientOptions } from "tevm";
import { optimism } from "tevm/common";
import { createSyncPersister } from "tevm/sync-storage-persister";

const options: MemoryClientOptions = {
  // Fork configuration to pull state from a live network
  fork: {
    transport: http("https://mainnet.optimism.io")({}),
    blockTag: '0xa6a63cd70fbbe396321ca6fe79e1b6735760c03538208b50d7e3a5dac5226435',
  },
  // Chain configuration
  common: optimism,
  // Client identification
  name: 'Optimism Memory Client',
  key: 'optimism-memory',
  // Mining configuration (auto mines blocks after transactions)
  miningConfig: {
    type: 'auto'
  },
  // Client performance tuning
  pollingInterval: 1000,
  cacheTime: 60000,
  // State persistence
  persister: createSyncPersister({
    storage: localStorage,
    key: 'tevm-state'
  }),
  // Enable unlimited contract sizes (for testing very large contracts)
  allowUnlimitedContractSize: true,
  // Logging level
  loggingLevel: 'info'
};

const client = createMemoryClient(options);
```

## See

 - [MemoryClient](MemoryClient.md)
 - [CreateMemoryClientFn](CreateMemoryClientFn.md)
 - TevmNodeOptions

## Throws

When configuration options are incompatible or invalid.
