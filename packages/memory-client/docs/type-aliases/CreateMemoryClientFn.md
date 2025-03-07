[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / CreateMemoryClientFn

# Type Alias: CreateMemoryClientFn()

> **CreateMemoryClientFn**: \<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>(`options`?) => [`MemoryClient`](MemoryClient.md)\<`TCommon`, `TAccountOrAddress`\>

Defined in: [packages/memory-client/src/CreateMemoryClientFn.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/CreateMemoryClientFn.ts#L36)

Type definition for the function that creates a [MemoryClient](MemoryClient.md).
This function initializes a MemoryClient with the provided options,
including forking configurations, logging levels, and state persistence options.

## Type Parameters

• **TCommon** *extends* `Common` & `Chain` = `Common` & `Chain`

The common chain configuration, extending both `Common` and `Chain`.

• **TAccountOrAddress** *extends* `Account` \| `Address` \| `undefined` = `undefined`

The account or address type for the client.

• **TRpcSchema** *extends* `RpcSchema` \| `undefined` = [`TevmRpcSchema`](TevmRpcSchema.md)

The RPC schema type, defaults to `TevmRpcSchema`.

## Parameters

### options?

[`MemoryClientOptions`](MemoryClientOptions.md)\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>

The options to configure the MemoryClient.

## Returns

[`MemoryClient`](MemoryClient.md)\<`TCommon`, `TAccountOrAddress`\>

- A configured MemoryClient instance.

## Example

```typescript
import { createMemoryClient } from "tevm";
import { optimism } from "tevm/common";

const client = createMemoryClient({
  fork: {
    transport: http("https://mainnet.optimism.io")({}),
    blockTag: '0xa6a63cd70fbbe396321ca6fe79e1b6735760c03538208b50d7e3a5dac5226435',
  },
  common: optimism,
});
```

## See

For more details on using the MemoryClient, refer to [MemoryClient](MemoryClient.md).
