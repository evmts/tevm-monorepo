[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / dumpStorageRange

# Function: dumpStorageRange()

> **dumpStorageRange**(`baseState`, `skipFetchingFromFork?`): (`address`, `startKey`, `limit`) => `Promise`\<`StorageRange`\>

Defined in: packages/state/src/actions/dumpStorageRange.js:7

## Parameters

### baseState

[`BaseState`](../type-aliases/BaseState.md)

### skipFetchingFromFork?

`boolean`

## Returns

> (`address`, `startKey`, `limit`): `Promise`\<`StorageRange`\>

Dumps a range of storage values

### Parameters

#### address

`Address`

#### startKey

`bigint`

#### limit

`number`

### Returns

`Promise`\<`StorageRange`\>
