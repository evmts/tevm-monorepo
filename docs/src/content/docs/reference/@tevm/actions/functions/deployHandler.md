---
editUrl: false
next: false
prev: false
title: "deployHandler"
---

> **deployHandler**(`client`, `options`?): [`DeployHandler`](/reference/tevm/actions-types/type-aliases/deployhandler/)

Creates an DeployHandler for handling deploying a contract to tevm

## Parameters

• **client**: `BaseClient`\<`"fork"` \| `"normal"`, `object`\>

• **options?**= `{}`

• **options.throwOnFail?**: `undefined` \| `boolean`= `true`

whether to default to throwing or not when errors occur

## Returns

[`DeployHandler`](/reference/tevm/actions-types/type-aliases/deployhandler/)

## Source

[packages/actions/src/tevm/deployHandler.js:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/tevm/deployHandler.js#L19)
