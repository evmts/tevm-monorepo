[**@tevm/memory-client**](../README.md) • **Docs**

***

[@tevm/memory-client](../globals.md) / MemoryClientOptions

# Type Alias: MemoryClientOptions\<TCommon, TAccountOrAddress, TRpcSchema\>

> **MemoryClientOptions**\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\>: `BaseClientOptions`\<`TCommon`\> & `Pick`\<`ClientConfig`\<`Transport`, `TCommon`, `TAccountOrAddress`, `TRpcSchema`\>, `"type"` \| `"key"` \| `"name"` \| `"account"` \| `"pollingInterval"` \| `"cacheTime"`\>

## Type Parameters

• **TCommon** *extends* `Common` & `Chain` = `Common` & `Chain`

• **TAccountOrAddress** *extends* `Account` \| `Address` \| `undefined` = `undefined`

• **TRpcSchema** *extends* `RpcSchema` \| `undefined` = [`TevmRpcSchema`](TevmRpcSchema.md)

## Defined in

[packages/memory-client/src/MemoryClientOptions.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/MemoryClientOptions.ts#L7)
