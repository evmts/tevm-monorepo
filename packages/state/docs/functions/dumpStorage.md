[**@tevm/state**](../README.md) • **Docs**

***

[@tevm/state](../globals.md) / dumpStorage

# Function: dumpStorage()

> **dumpStorage**(`baseState`): (`address`) => `Promise`\<`StorageDump`\>

Dumps the RLP-encoded storage values for an `account` specified by `address`.
Keys are the storage keys, values are the storage values as strings.
Both are represented as `0x` prefixed hex strings.

## Parameters

• **baseState**: [`BaseState`](../type-aliases/BaseState.md)

## Returns

`Function`

### Parameters

• **address**: `Address`

### Returns

`Promise`\<`StorageDump`\>

## Source

[packages/state/src/actions/dumpStorage.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/dumpStorage.js#L9)
