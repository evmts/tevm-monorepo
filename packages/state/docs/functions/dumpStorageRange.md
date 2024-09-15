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

## Defined in

[packages/state/src/actions/dumpStorageRange.js:7](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/state/src/actions/dumpStorageRange.js#L7)
