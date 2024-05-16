[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [state](../README.md) / dumpStorage

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

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

### Returns

`Promise`\<`StorageDump`\>

## Source

packages/state/dist/index.d.ts:232
