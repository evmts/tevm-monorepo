---
editUrl: false
next: false
prev: false
title: "loadStateHandler"
---

> **loadStateHandler**(`client`, `options`?): [`LoadStateHandler`](/reference/tevm/actions/type-aliases/loadstatehandler/)

## Parameters

• **client**: `BaseClient`\<`"fork"` \| `"normal"`, `object`\>

The base client instance.

• **options?** = `{}`

Optional configuration.

• **options.throwOnFail?**: `undefined` \| `boolean`

Whether to throw an error when a failure occurs.

## Returns

[`LoadStateHandler`](/reference/tevm/actions/type-aliases/loadstatehandler/)

- The handler function.

## Defined in

[packages/actions/src/LoadState/loadStateHandler.js:35](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/LoadState/loadStateHandler.js#L35)
