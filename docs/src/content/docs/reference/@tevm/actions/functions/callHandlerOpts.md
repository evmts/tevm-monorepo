---
editUrl: false
next: false
prev: false
title: "callHandlerOpts"
---

> **callHandlerOpts**(`client`, `params`): `Promise`\<`object`\>

## Parameters

• **client**: `BaseClient`\<`"fork"` \| `"normal"`, `object`\>

• **params**: [`CallParams`](/reference/tevm/actions/type-aliases/callparams/)\<`boolean`\>

## Returns

`Promise`\<`object`\>

### data?

> `optional` **data**: [`EvmRunCallOpts`](/reference/tevm/evm/interfaces/evmruncallopts/)

### errors?

> `optional` **errors**: [`CallHandlerOptsError`](/reference/tevm/actions/type-aliases/callhandleroptserror/)[]

## Defined in

[packages/actions/src/Call/callHandlerOpts.js:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/callHandlerOpts.js#L19)
