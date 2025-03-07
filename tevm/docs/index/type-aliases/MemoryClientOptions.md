[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / MemoryClientOptions

# Type Alias: MemoryClientOptions\<TCommon, TAccountOrAddress, TRpcSchema\>

> **MemoryClientOptions**\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>: [`TevmNodeOptions`](TevmNodeOptions.md)\<`TCommon`\> & `Pick`\<`ClientConfig`\<`Transport`, `TCommon`, `TAccountOrAddress`, `TRpcSchema`\>, `"type"` \| `"key"` \| `"name"` \| `"account"` \| `"pollingInterval"` \| `"cacheTime"`\>

Defined in: packages/memory-client/types/MemoryClientOptions.d.ts:49

Configuration options for creating a [MemoryClient](MemoryClient.md).

This type extends `TevmNodeOptions` and includes specific options for configuring the MemoryClient,
such as the transport type, account, polling interval, and caching behavior.

## Type Parameters

• **TCommon** *extends* [`Common`](../../common/type-aliases/Common.md) & `Chain` = [`Common`](../../common/type-aliases/Common.md) & `Chain`

The common chain configuration, extending both `Common` and `Chain`.

• **TAccountOrAddress** *extends* [`Account`](Account.md) \| [`Address`](Address.md) \| `undefined` = `undefined`

The account or address type for the client.

• **TRpcSchema** *extends* `RpcSchema` \| `undefined` = [`TevmRpcSchema`](TevmRpcSchema.md)

The RPC schema type, defaults to `TevmRpcSchema`.

## Example

```typescript
import { createMemoryClient, type MemoryClientOptions } from "tevm";
import { optimism } from "tevm/common";

const options: MemoryClientOptions = {
  fork: {
    transport: http("https://mainnet.optimism.io")({}),
    blockTag: '0xa6a63cd70fbbe396321ca6fe79e1b6735760c03538208b50d7e3a5dac5226435',
  },
  common: optimism,
  name: 'Optimism Memory Client',
  pollingInterval: 1000,
  cacheTime: 60000,
};

const client = createMemoryClient(options);
```

## See

 - [MemoryClient](MemoryClient.md)
 - [CreateMemoryClientFn](CreateMemoryClientFn.md)
