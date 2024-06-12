---
editUrl: false
next: false
prev: false
title: "callHandlerOpts"
---

> **callHandlerOpts**(`client`, `params`): `Promise`\<`object`\>

Parses user provided params into ethereumjs options to pass into the EVM

## Parameters

• **client**: `BaseClient`\<`"fork"` \| `"normal"`, `object`\>

• **params**: [`CallParams`](/reference/tevm/actions/type-aliases/callparams-1/)\<`boolean`\>

## Returns

`Promise`\<`object`\>

### data?

> `optional` **data**: [`EvmRunCallOpts`](/reference/tevm/evm/interfaces/evmruncallopts/)

### errors?

> `optional` **errors**: [`CallHandlerOptsError`](/reference/tevm/actions/type-aliases/callhandleroptserror-1/)[]

## Throws

Returns all errors as values

## Source

[packages/actions/src/Call/callHandlerOpts.js:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/callHandlerOpts.js#L17)
