---
editUrl: false
next: false
prev: false
title: "CreateMemoryClientFn"
---

> **CreateMemoryClientFn**: \<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>(`options`?) => [`MemoryClient`](/reference/tevm/memory-client/type-aliases/memoryclient/)\<`TCommon`, `TAccountOrAddress`\>

## Type Parameters

• **TCommon** *extends* [`Common`](/reference/tevm/common/type-aliases/common/) & `Chain` = [`Common`](/reference/tevm/common/type-aliases/common/) & `Chain`

• **TAccountOrAddress** *extends* `Account` \| [`Address`](/reference/tevm/utils/type-aliases/address/) \| `undefined` = `undefined`

• **TRpcSchema** *extends* `RpcSchema` \| `undefined` = [`TevmRpcSchema`](/reference/tevm/memory-client/type-aliases/tevmrpcschema/)

## Parameters

• **options?**: [`MemoryClientOptions`](/reference/tevm/memory-client/type-aliases/memoryclientoptions/)\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>

## Returns

[`MemoryClient`](/reference/tevm/memory-client/type-aliases/memoryclient/)\<`TCommon`, `TAccountOrAddress`\>

## Defined in

[packages/memory-client/src/CreateMemoryClientFn.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/CreateMemoryClientFn.ts#L8)
