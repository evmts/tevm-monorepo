---
editUrl: false
next: false
prev: false
title: "deployHandler"
---

> **deployHandler**(`client`, `options`?): [`DeployHandler`](/reference/tevm/actions/type-aliases/deployhandler/)

Creates an DeployHandler for handling deploying a contract to tevm

## Parameters

• **client**: `BaseClient`\<`"fork"` \| `"normal"`, `object`\>

• **options?**= `{}`

• **options.throwOnFail?**: `undefined` \| `boolean`= `true`

whether to default to throwing or not when errors occur

## Returns

[`DeployHandler`](/reference/tevm/actions/type-aliases/deployhandler/)

## Source

[packages/actions/src/Deploy/deployHandler.js:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Deploy/deployHandler.js#L17)
