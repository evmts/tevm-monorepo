---
editUrl: false
next: false
prev: false
title: "getProof"
---

> **getProof**(`baseState`, `skipFetchingFromFork`?): (`address`, `storageSlots`?) => `Promise`\<`Proof`\>

Get an EIP-1186 proof from the provider

## Parameters

• **baseState**: [`BaseState`](/reference/tevm/state/type-aliases/basestate/)

• **skipFetchingFromFork?**: `boolean`

## Returns

`Function`

### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

• **storageSlots?**: `Uint8Array`[]

### Returns

`Promise`\<`Proof`\>

## Defined in

[packages/state/src/actions/getProof.js:10](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/state/src/actions/getProof.js#L10)
