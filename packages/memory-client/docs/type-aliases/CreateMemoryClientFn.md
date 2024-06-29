[**@tevm/memory-client**](../README.md) • **Docs**

***

[@tevm/memory-client](../globals.md) / CreateMemoryClientFn

# Type Alias: CreateMemoryClientFn()

> **CreateMemoryClientFn**: \<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>(`options`?) => [`MemoryClient`](MemoryClient.md)\<`TCommon`, `TAccountOrAddress`\>

## Type Parameters

• **TCommon** *extends* `Common` & `Chain` = `Common` & `Chain`

The common chain configuration, extending both `Common` and `Chain`.

• **TAccountOrAddress** *extends* `Account` \| `Address` \| `undefined` = `undefined`

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

[packages/memory-client/src/CreateMemoryClientFn.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/CreateMemoryClientFn.ts#L36)
