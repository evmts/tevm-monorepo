[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / Filter

# Type Alias: Filter

> **Filter**: `object`

Internal representation of a registered filter

## Type declaration

### blocks

> **blocks**: [`Block`](../../block/classes/Block.md)[]

Stores the blocks

### created

> **created**: `number`

Creation timestamp

### err

> **err**: `Error` \| `undefined`

Error if any

### id

> **id**: [`Hex`](Hex.md)

Id of the filter

### installed

> **installed**: `object`

Not sure what this is yet

### logs

> **logs**: `GetFilterLogsReturnType`\[`number`\][]

Stores logs

### logsCriteria?

> `optional` **logsCriteria**: `TODO`

Criteria of the logs
https://github.com/ethereum/go-ethereum/blob/master/eth/filters/filter_system.go#L329

### registeredListeners

> **registeredListeners**: (...`args`) => `any`[]

Listeners registered for the filter

### tx

> **tx**: [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)[]

stores tx

### type

> **type**: [`FilterType`](FilterType.md)

The type of the filter

## Defined in

packages/node/dist/index.d.ts:63
