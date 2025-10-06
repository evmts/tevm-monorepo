[**@tevm/test-node**](../README.md)

***

[@tevm/test-node](../globals.md) / TestSnapshotClientOptions

# Type Alias: TestSnapshotClientOptions\<TCommon, TAccountOrAddress, TRpcSchema\>

> **TestSnapshotClientOptions**\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\> = `MemoryClientOptions`\<`TCommon`, `TAccountOrAddress`, `TRpcSchema`\> & `object`

Defined in: [extensions/test-node/src/types.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/extensions/test-node/src/types.ts#L56)

## Type Declaration

### test?

> `optional` **test**: [`TestOptions`](TestOptions.md)

## Type Parameters

### TCommon

`TCommon` *extends* `Common` & `Chain` = `Common` & `Chain`

### TAccountOrAddress

`TAccountOrAddress` *extends* `Account` \| `Address` \| `undefined` = `undefined`

### TRpcSchema

`TRpcSchema` *extends* `RpcSchema` \| `undefined` = `TevmRpcSchema`
