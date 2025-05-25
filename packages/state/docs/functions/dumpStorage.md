[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / dumpStorage

# Function: dumpStorage()

> **dumpStorage**(`baseState`, `skipFetchingFromFork?`): (`address`) => `Promise`\<`StorageDump`\>

Defined in: packages/state/src/actions/dumpStorage.js:9

Dumps the RLP-encoded storage values for an `account` specified by `address`.
Keys are the storage keys, values are the storage values as strings.
Both are represented as `0x` prefixed hex strings.

## Parameters

### baseState

[`BaseState`](../type-aliases/BaseState.md)

### skipFetchingFromFork?

`boolean`

## Returns

> (`address`): `Promise`\<`StorageDump`\>

Dumps storage based on the input

### Parameters

#### address

`Address`

### Returns

`Promise`\<`StorageDump`\>
