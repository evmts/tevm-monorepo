---
editUrl: false
next: false
prev: false
title: "CreateMemoryClientFn"
---

> **CreateMemoryClientFn**: \<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>(`options`?) => [`MemoryClient`](/reference/tevm/memory-client/type-aliases/memoryclient/)\<`TCommon`, `TAccountOrAddress`\>

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

## Defined in

[packages/memory-client/src/CreateMemoryClientFn.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/CreateMemoryClientFn.ts#L36)
