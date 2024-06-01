---
editUrl: false
next: false
prev: false
title: "Filter"
---

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

> **id**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

Id of the filter

### installed

> **installed**: `object`

Not sure what this is yet

### logs

> **logs**: [`EthjsLog`](/reference/tevm/utils/type-aliases/ethjslog/)[]

Stores logs

### logsCriteria?

> `optional` **logsCriteria**: `TODO`

Criteria of the logs
https://github.com/ethereum/go-ethereum/blob/master/eth/filters/filter_system.go#L329

### tx

> **tx**: `TypedTransaction`[]

stores tx

### type

> **type**: [`FilterType`](/reference/tevm/base-client/type-aliases/filtertype/)

The type of the filter

## Source

[packages/base-client/src/Filter.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/base-client/src/Filter.ts#L13)
