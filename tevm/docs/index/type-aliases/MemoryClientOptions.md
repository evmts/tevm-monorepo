[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / MemoryClientOptions

# Type Alias: MemoryClientOptions\<TCommon, TAccountOrAddress, TRpcSchema\>

> **MemoryClientOptions**\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>: [`BaseClientOptions`](BaseClientOptions.md)\<`TCommon`\> & `Pick`\<`ClientConfig`\<`Transport`, `TCommon`, `TAccountOrAddress`, `TRpcSchema`\>, `"type"` \| `"key"` \| `"name"` \| `"account"` \| `"pollingInterval"` \| `"cacheTime"`\>

## Type Parameters

• **TCommon** *extends* [`Common`](../../common/type-aliases/Common.md) & `Chain` = [`Common`](../../common/type-aliases/Common.md) & `Chain`

• **TAccountOrAddress** *extends* `Account` \| [`Address`](Address.md) \| `undefined` = `undefined`

• **TRpcSchema** *extends* `RpcSchema` \| `undefined` = [`TevmRpcSchema`](TevmRpcSchema.md)

## Defined in

packages/memory-client/types/MemoryClientOptions.d.ts:6
