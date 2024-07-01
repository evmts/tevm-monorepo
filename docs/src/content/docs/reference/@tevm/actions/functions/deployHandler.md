---
editUrl: false
next: false
prev: false
title: "deployHandler"
---

> **deployHandler**(`client`, `options`?): [`DeployHandler`](/reference/tevm/actions/type-aliases/deployhandler/)

## Parameters

• **client**: `BaseClient`\<`"fork"` \| `"normal"`, `object`\>

The TEVM base client instance.

• **options?** = `{}`

Optional parameters.

• **options.throwOnFail?**: `undefined` \| `boolean` = `true`

Whether to throw an error on failure.

## Returns

[`DeployHandler`](/reference/tevm/actions/type-aliases/deployhandler/)

The deploy handler function.

## Defined in

[packages/actions/src/Deploy/deployHandler.js:37](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Deploy/deployHandler.js#L37)
