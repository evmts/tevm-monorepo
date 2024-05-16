---
editUrl: false
next: false
prev: false
title: "getProof"
---

> **getProof**(`baseState`): (`address`, `storageSlots`?) => `Promise`\<`Proof`\>

Get an EIP-1186 proof from the provider

## Parameters

• **baseState**: [`BaseState`](/reference/tevm/state/type-aliases/basestate/)

## Returns

`Function`

### Parameters

• **address**: [`EthjsAddress`](/reference/tevm/utils/classes/ethjsaddress/)

• **storageSlots?**: `Uint8Array`[]

### Returns

`Promise`\<`Proof`\>

## Source

[packages/state/src/actions/getProof.js:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/getProof.js#L10)
