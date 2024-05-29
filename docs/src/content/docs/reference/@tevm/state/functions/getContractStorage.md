---
editUrl: false
next: false
prev: false
title: "getContractStorage"
---

> **getContractStorage**(`baseState`, `skipFetchingFromFork`?): (`address`, `key`) => `Promise`\<`Uint8Array`\>

Gets the storage value associated with the provided `address` and `key`. This method returns
the shortest representation of the stored value.
corresponding to the provided address at the provided key.
If this does not exist an empty `Uint8Array` is returned.

## Parameters

• **baseState**: [`BaseState`](/reference/tevm/state/type-aliases/basestate/)

• **skipFetchingFromFork?**: `boolean`

## Returns

`Function`

### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

• **key**: `Uint8Array`

### Returns

`Promise`\<`Uint8Array`\>

## Source

[packages/state/src/actions/getContractStorage.js:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/getContractStorage.js#L14)
