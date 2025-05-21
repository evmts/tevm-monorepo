[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / dumpStorageRange

# Function: dumpStorageRange()

> **dumpStorageRange**(`baseState`, `skipFetchingFromFork?`): (`address`, `startKey`, `limit`) => `Promise`\<`StorageRange`\>

Defined in: [packages/state/src/actions/dumpStorageRange.js:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/dumpStorageRange.js#L7)

## Parameters

### baseState

[`BaseState`](../type-aliases/BaseState.md)

### skipFetchingFromFork?

`boolean`

## Returns

> (`address`, `startKey`, `limit`): `Promise`\<`StorageRange`\>

### Parameters

#### address

`Address`

#### startKey

`bigint`

#### limit

`number`

### Returns

`Promise`\<`StorageRange`\>
