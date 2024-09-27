---
editUrl: false
next: false
prev: false
title: "callHandlerOpts"
---

> **callHandlerOpts**(`client`, `params`): `Promise`\<`object` \| `object`\>

Parses user provided params into ethereumjs options to pass into the EVM

## Parameters

• **client**: `TevmNode`\<`"fork"` \| `"normal"`, `object`\>

• **params**: [`CallParams`](/reference/tevm/actions/type-aliases/callparams/)\<`boolean`\>

## Returns

`Promise`\<`object` \| `object`\>

## Throws

Returns all errors as values

## Defined in

[packages/actions/src/Call/callHandlerOpts.js:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/callHandlerOpts.js#L19)
