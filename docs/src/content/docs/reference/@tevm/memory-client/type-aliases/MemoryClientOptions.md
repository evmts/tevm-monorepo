---
editUrl: false
next: false
prev: false
title: "MemoryClientOptions"
---

> **MemoryClientOptions**\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>: `BaseClientOptions`\<`TCommon`\> & `Pick`\<`ClientConfig`\<`Transport`, `TCommon`, `TAccountOrAddress`, `TRpcSchema`\>, `"type"` \| `"key"` \| `"name"` \| `"account"` \| `"pollingInterval"` \| `"cacheTime"`\>

## Type Parameters

• **TCommon** *extends* [`Common`](/reference/tevm/common/type-aliases/common/) & `Chain` = [`Common`](/reference/tevm/common/type-aliases/common/) & `Chain`

• **TAccountOrAddress** *extends* `Account` \| [`Address`](/reference/tevm/utils/type-aliases/address/) \| `undefined` = `undefined`

• **TRpcSchema** *extends* `RpcSchema` \| `undefined` = [`TevmRpcSchema`](/reference/tevm/memory-client/type-aliases/tevmrpcschema/)

## Defined in

[packages/memory-client/src/MemoryClientOptions.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/MemoryClientOptions.ts#L7)
