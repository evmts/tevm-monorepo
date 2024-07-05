---
editUrl: false
next: false
prev: false
title: "MemoryClientOptions"
---

> **MemoryClientOptions**\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>: `BaseClientOptions`\<`TCommon`\> & `Pick`\<`ClientConfig`\<`Transport`, `TCommon`, `TAccountOrAddress`, `TRpcSchema`\>, `"type"` \| `"key"` \| `"name"` \| `"account"` \| `"pollingInterval"` \| `"cacheTime"`\>

Configuration options for creating a [MemoryClient](../../../../../../../reference/tevm/memory-client/type-aliases/memoryclient).

This type extends `BaseClientOptions` and includes specific options for configuring the MemoryClient,
such as the transport type, account, polling interval, and caching behavior.

## Type Parameters

• **TCommon** *extends* [`Common`](/reference/tevm/common/type-aliases/common/) & `Chain` = [`Common`](/reference/tevm/common/type-aliases/common/) & `Chain`

The common chain configuration, extending both `Common` and `Chain`.

• **TAccountOrAddress** *extends* `Account` \| [`Address`](/reference/tevm/utils/type-aliases/address/) \| `undefined` = `undefined`

The account or address type for the client.

• **TRpcSchema** *extends* `RpcSchema` \| `undefined` = [`TevmRpcSchema`](/reference/tevm/memory-client/type-aliases/tevmrpcschema/)

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

 - [MemoryClient](../../../../../../../reference/tevm/memory-client/type-aliases/memoryclient)
 - [CreateMemoryClientFn](../../../../../../../reference/tevm/memory-client/type-aliases/creatememoryclientfn)

## Defined in

[packages/memory-client/src/MemoryClientOptions.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/MemoryClientOptions.ts#L50)
