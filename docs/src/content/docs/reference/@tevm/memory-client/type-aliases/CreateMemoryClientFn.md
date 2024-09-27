---
editUrl: false
next: false
prev: false
title: "CreateMemoryClientFn"
---

> **CreateMemoryClientFn**: \<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>(`options`?) => [`MemoryClient`](/reference/tevm/memory-client/type-aliases/memoryclient/)\<`TCommon`, `TAccountOrAddress`\>

Type definition for the function that creates a [MemoryClient](../../../../../../../reference/tevm/memory-client/type-aliases/memoryclient).
This function initializes a MemoryClient with the provided options,
including forking configurations, logging levels, and state persistence options.

## Type Parameters

• **TCommon** *extends* [`Common`](/reference/tevm/common/type-aliases/common/) & `Chain` = [`Common`](/reference/tevm/common/type-aliases/common/) & `Chain`

The common chain configuration, extending both `Common` and `Chain`.

• **TAccountOrAddress** *extends* [`Account`](/reference/tevm/utils/type-aliases/account/) \| [`Address`](/reference/tevm/utils/type-aliases/address/) \| `undefined` = `undefined`

The account or address type for the client.

• **TRpcSchema** *extends* `RpcSchema` \| `undefined` = [`TevmRpcSchema`](/reference/tevm/memory-client/type-aliases/tevmrpcschema/)

The RPC schema type, defaults to `TevmRpcSchema`.

## Parameters

• **options?**: [`MemoryClientOptions`](/reference/tevm/memory-client/type-aliases/memoryclientoptions/)\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>

The options to configure the MemoryClient.

## Returns

[`MemoryClient`](/reference/tevm/memory-client/type-aliases/memoryclient/)\<`TCommon`, `TAccountOrAddress`\>

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

For more details on using the MemoryClient, refer to [MemoryClient](../../../../../../../reference/tevm/memory-client/type-aliases/memoryclient).

## Defined in

[packages/memory-client/src/CreateMemoryClientFn.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/CreateMemoryClientFn.ts#L36)
