[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [state](../README.md) / dumpStorageRange

# Function: dumpStorageRange()

> **dumpStorageRange**(`baseState`, `skipFetchingFromFork`?): (`address`, `startKey`, `limit`) => `Promise`\<[`StorageRange`](../../common/interfaces/StorageRange.md)\>

## Parameters

• **baseState**: [`BaseState`](../type-aliases/BaseState.md)

• **skipFetchingFromFork?**: `boolean`

## Returns

`Function`

### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

• **startKey**: `bigint`

• **limit**: `number`

### Returns

`Promise`\<[`StorageRange`](../../common/interfaces/StorageRange.md)\>

## Source

packages/state/dist/index.d.ts:244
