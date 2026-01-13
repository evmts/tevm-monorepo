[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DebugStorageRangeAtResult

# Type Alias: DebugStorageRangeAtResult

> **DebugStorageRangeAtResult** = `object`

Defined in: [packages/actions/src/debug/DebugResult.ts:236](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L236)

Result from `debug_storageRangeAt`

## Properties

### nextKey

> **nextKey**: [`Hex`](Hex.md) \| `null`

Defined in: [packages/actions/src/debug/DebugResult.ts:244](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L244)

Next storage key for pagination (null if no more entries)

***

### storage

> **storage**: `Record`\<[`Hex`](Hex.md), [`DebugStorageEntry`](DebugStorageEntry.md)\>

Defined in: [packages/actions/src/debug/DebugResult.ts:240](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/debug/DebugResult.ts#L240)

Storage entries
