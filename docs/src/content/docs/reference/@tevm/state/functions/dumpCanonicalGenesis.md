---
editUrl: false
next: false
prev: false
title: "dumpCanonicalGenesis"
---

> **dumpCanonicalGenesis**(`baseState`, `skipFetchingFromFork`?): () => `Promise`\<[`TevmState`](/reference/tevm/state/type-aliases/tevmstate/)\>

Dumps the state of the state manager as a [TevmState](../../../../../../../reference/tevm/state/type-aliases/tevmstate)

## Parameters

• **baseState**: [`BaseState`](/reference/tevm/state/type-aliases/basestate/)

• **skipFetchingFromFork?**: `boolean`

## Returns

`Function`

Dumps the state of the state manager as a [TevmState](../../../../../../../reference/tevm/state/type-aliases/tevmstate)

### Returns

`Promise`\<[`TevmState`](/reference/tevm/state/type-aliases/tevmstate/)\>

## Defined in

[packages/state/src/actions/dumpCannonicalGenesis.js:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/state/src/actions/dumpCannonicalGenesis.js#L15)
