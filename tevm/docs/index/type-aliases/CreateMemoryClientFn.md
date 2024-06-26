[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / CreateMemoryClientFn

# Type Alias: CreateMemoryClientFn()

> **CreateMemoryClientFn**: \<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>(`options`?) => [`MemoryClient`](MemoryClient.md)\<`TCommon`, `TAccountOrAddress`\>

## Type Parameters

• **TCommon** *extends* [`Common`](../../common/type-aliases/Common.md) & `Chain` = [`Common`](../../common/type-aliases/Common.md) & `Chain`

• **TAccountOrAddress** *extends* `Account` \| [`Address`](Address.md) \| `undefined` = `undefined`

• **TRpcSchema** *extends* `RpcSchema` \| `undefined` = [`TevmRpcSchema`](TevmRpcSchema.md)

## Parameters

• **options?**: [`MemoryClientOptions`](MemoryClientOptions.md)\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>

## Returns

[`MemoryClient`](MemoryClient.md)\<`TCommon`, `TAccountOrAddress`\>

## Defined in

packages/memory-client/types/CreateMemoryClientFn.d.ts:7
