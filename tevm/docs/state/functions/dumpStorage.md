[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / dumpStorage

# Function: dumpStorage()

> **dumpStorage**(`baseState`, `skipFetchingFromFork`?): (`address`) => `Promise`\<[`StorageDump`](../../common/interfaces/StorageDump.md)\>

Defined in: packages/state/dist/index.d.ts:253

Dumps the RLP-encoded storage values for an `account` specified by `address`.
Keys are the storage keys, values are the storage values as strings.
Both are represented as `0x` prefixed hex strings.

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

### Returns

`Promise`\<[`StorageDump`](../../common/interfaces/StorageDump.md)\>
