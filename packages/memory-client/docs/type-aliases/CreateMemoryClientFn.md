[**@tevm/memory-client**](../README.md) • **Docs**

***

[@tevm/memory-client](../globals.md) / CreateMemoryClientFn

# Type Alias: CreateMemoryClientFn()

> **CreateMemoryClientFn**: \<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>(`options`?) => [`MemoryClient`](MemoryClient.md)\<`TCommon`, `TAccountOrAddress`\>

## Type Parameters

• **TCommon** *extends* `Common` & `Chain` = `Common` & `Chain`

• **TAccountOrAddress** *extends* `Account` \| `Address` \| `undefined` = `undefined`

• **TRpcSchema** *extends* `RpcSchema` \| `undefined` = [`TevmRpcSchema`](TevmRpcSchema.md)

## Parameters

• **options?**: [`MemoryClientOptions`](MemoryClientOptions.md)\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>

## Returns

[`MemoryClient`](MemoryClient.md)\<`TCommon`, `TAccountOrAddress`\>

## Defined in

[packages/memory-client/src/CreateMemoryClientFn.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/CreateMemoryClientFn.ts#L8)
