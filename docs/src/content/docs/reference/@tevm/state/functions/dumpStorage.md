---
editUrl: false
next: false
prev: false
title: "dumpStorage"
---

> **dumpStorage**(`baseState`, `skipFetchingFromFork`?): (`address`) => `Promise`\<[`StorageDump`](/reference/tevm/common/interfaces/storagedump/)\>

Dumps the RLP-encoded storage values for an `account` specified by `address`.
Keys are the storage keys, values are the storage values as strings.
Both are represented as `0x` prefixed hex strings.

## Parameters

• **baseState**: [`BaseState`](/reference/tevm/state/type-aliases/basestate/)

• **skipFetchingFromFork?**: `boolean`

## Returns

`Function`

### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

### Returns

`Promise`\<[`StorageDump`](/reference/tevm/common/interfaces/storagedump/)\>

## Defined in

[packages/state/src/actions/dumpStorage.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/dumpStorage.js#L9)
