[**@tevm/state**](../README.md) • **Docs**

***

[@tevm/state](../globals.md) / dumpStorageRange

# Function: dumpStorageRange()

> **dumpStorageRange**(`baseState`, `skipFetchingFromFork`?): (`address`, `startKey`, `limit`) => `Promise`\<`StorageRange`\>

## Parameters

• **baseState**: [`BaseState`](../type-aliases/BaseState.md)

• **skipFetchingFromFork?**: `boolean`

## Returns

`Function`

### Parameters

• **address**: `Address`

• **startKey**: `bigint`

• **limit**: `number`

### Returns

`Promise`\<`StorageRange`\>

## Source

[packages/state/src/actions/dumpStorageRange.js:4](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/dumpStorageRange.js#L4)
