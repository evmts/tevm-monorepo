[**@tevm/memory-client**](../README.md) • **Docs**

***

[@tevm/memory-client](../globals.md) / MemoryClientOptions

# Type Alias: MemoryClientOptions\<TCommon, TAccountOrAddress, TRpcSchema\>

> **MemoryClientOptions**\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>: `TevmNodeOptions`\<`TCommon`\> & `Pick`\<`ClientConfig`\<`Transport`, `TCommon`, `TAccountOrAddress`, `TRpcSchema`\>, `"type"` \| `"key"` \| `"name"` \| `"account"` \| `"pollingInterval"` \| `"cacheTime"`\>

Configuration options for creating a [MemoryClient](MemoryClient.md).

This type extends `TevmNodeOptions` and includes specific options for configuring the MemoryClient,
such as the transport type, account, polling interval, and caching behavior.

## Type Parameters

• **TCommon** *extends* `Common` & `Chain` = `Common` & `Chain`

The common chain configuration, extending both `Common` and `Chain`.

• **TAccountOrAddress** *extends* `Account` \| `Address` \| `undefined` = `undefined`

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

## Defined in

[packages/memory-client/src/MemoryClientOptions.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/MemoryClientOptions.ts#L50)
