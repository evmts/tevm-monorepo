---
editUrl: false
next: false
prev: false
title: "callHandler"
---

> **callHandler**(`client`, `options`?): [`CallHandler`](/reference/tevm/actions/type-aliases/callhandler/)

## Parameters

• **client**: `BaseClient`\<`"fork"` \| `"normal"`, `object`\>

The TEVM base client instance.

• **options?** = `{}`

Optional parameters.

• **options.throwOnFail?**: `undefined` \| `boolean` = `true`

Whether to throw an error on failure.

## Returns

[`CallHandler`](/reference/tevm/actions/type-aliases/callhandler/)

The call handler function.

## Defined in

[packages/actions/src/Call/callHandler.js:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/callHandler.js#L45)
