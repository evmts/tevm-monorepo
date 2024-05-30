[**@tevm/base-client**](../README.md) • **Docs**

***

[@tevm/base-client](../globals.md) / Filter

# Type alias: Filter

> **Filter**: `object`

Internal representation of a registered filter

## Type declaration

### blocks

> **blocks**: `Block`[]

Stores the blocks

### created

> **created**: `number`

Creation timestamp

### err

> **err**: `Error` \| `undefined`

Error if any

### id

> **id**: `Hex`

Id of the filter

### installed

> **installed**: `object`

Not sure what this is yet

### logs

> **logs**: `EthjsLog`[]

Stores logs

### logsCriteria?

> `optional` **logsCriteria**: `TODO`

Criteria of the logs
https://github.com/ethereum/go-ethereum/blob/master/eth/filters/filter_system.go#L329

### tx

> **tx**: `TypedTransaction`[]

stores tx

### type

> **type**: [`FilterType`](FilterType.md)

The type of the filter

## Source

[Filter.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/base-client/src/Filter.ts#L13)
