---
editUrl: false
next: false
prev: false
title: "shouldCreateTransaction"
---

> **shouldCreateTransaction**(`params`, `runTxResult`): `boolean`

**`Internal`**

Determines if a transaction should be created based on the `createTransaction` parameter

## Parameters

• **params**: [`CallParams`](/reference/tevm/actions/type-aliases/callparams/)\<`boolean`\>

• **runTxResult**: [`RunTxResult`](/reference/tevm/vm/interfaces/runtxresult/)

## Returns

`boolean`

## Throws

only if the `createTransaction` parameter is invalid based on ts type

## Defined in

[packages/actions/src/Call/shouldCreateTransaction.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/shouldCreateTransaction.js#L8)
