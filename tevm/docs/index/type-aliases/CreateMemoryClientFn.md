[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / CreateMemoryClientFn

# Type Alias: CreateMemoryClientFn()

> **CreateMemoryClientFn**: \<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>(`options`?) => [`MemoryClient`](MemoryClient.md)\<`TCommon`, `TAccountOrAddress`\>

## Type Parameters

• **TCommon** *extends* [`Common`](../../common/type-aliases/Common.md) & `Chain` = [`Common`](../../common/type-aliases/Common.md) & `Chain`

The common chain configuration, extending both `Common` and `Chain`.

• **TAccountOrAddress** *extends* `Account` \| [`Address`](Address.md) \| `undefined` = `undefined`

The account or address type for the client.

• **TRpcSchema** *extends* `RpcSchema` \| `undefined` = [`TevmRpcSchema`](TevmRpcSchema.md)

The RPC schema type, defaults to `TevmRpcSchema`.

## Parameters

• **options?**: [`MemoryClientOptions`](MemoryClientOptions.md)\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>

The options to configure the MemoryClient.

## Returns

[`MemoryClient`](MemoryClient.md)\<`TCommon`, `TAccountOrAddress`\>

- A configured MemoryClient instance.

## Defined in

packages/memory-client/types/CreateMemoryClientFn.d.ts:35
