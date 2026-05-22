[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugStorageRangeAtResult

# Type Alias: DebugStorageRangeAtResult

> **DebugStorageRangeAtResult** = `object`

Defined in: [packages/actions/src/debug/DebugResult.ts:236](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L236)

Result from `debug_storageRangeAt`

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="nextkey"></a> `nextKey` | [`Hex`](Hex.md) \| `null` | Next storage key for pagination (null if no more entries) | [packages/actions/src/debug/DebugResult.ts:244](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L244) |
| <a id="storage"></a> `storage` | `Record`\<[`Hex`](Hex.md), [`DebugStorageEntry`](DebugStorageEntry.md)\> | Storage entries | [packages/actions/src/debug/DebugResult.ts:240](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L240) |
