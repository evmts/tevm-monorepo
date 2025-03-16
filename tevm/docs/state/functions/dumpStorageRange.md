[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / dumpStorageRange

# Function: dumpStorageRange()

> **dumpStorageRange**(`baseState`, `skipFetchingFromFork`?): (`address`, `startKey`, `limit`) => `Promise`\<[`StorageRange`](../../common/interfaces/StorageRange.md)\>

Defined in: packages/state/dist/index.d.ts:370

## Parameters

### baseState

[`BaseState`](../type-aliases/BaseState.md)

### skipFetchingFromFork?

`boolean`

## Returns

`Function`

### Parameters

#### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### startKey

`bigint`

#### limit

`number`

### Returns

`Promise`\<[`StorageRange`](../../common/interfaces/StorageRange.md)\>
