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

> **blocks**: [`Block`](/reference/tevm/block/classes/block/)[]

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

> **tx**: [`TypedTransaction`](/reference/tevm/tx/type-aliases/typedtransaction/)[]

stores tx

### type

> **type**: [`FilterType`](/reference/tevm/node/type-aliases/filtertype/)

The type of the filter

## Defined in

[packages/node/src/Filter.ts:14](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/node/src/Filter.ts#L14)
