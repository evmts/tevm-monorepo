[**@tevm/state**](../README.md)

***

[@tevm/state](../globals.md) / dumpStorage

# Function: dumpStorage()

> **dumpStorage**(`baseState`, `skipFetchingFromFork?`): (`address`) => `Promise`\<`StorageDump`\>

Defined in: [packages/state/src/actions/dumpStorage.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/dumpStorage.js#L9)

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

### Parameters

#### address

`Address`

### Returns

`Promise`\<`StorageDump`\>
