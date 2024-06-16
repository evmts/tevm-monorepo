---
editUrl: false
next: false
prev: false
title: "scriptHandler"
---

> **scriptHandler**(`client`, `options`?): [`ScriptHandler`](/reference/tevm/actions/type-aliases/scripthandler-1/)

:::caution[Deprecated]
can use `contractHandler` instead
Creates an ScriptHandler for handling script params with Ethereumjs EVM
:::

## Parameters

• **client**: `BaseClient`\<`"fork"` \| `"normal"`, `object`\>

• **options?**= `{}`

• **options.throwOnFail?**: `undefined` \| `boolean`

whether to default to throwing or not when errors occur

## Returns

[`ScriptHandler`](/reference/tevm/actions/type-aliases/scripthandler-1/)

## Source

[packages/actions/src/Script/scriptHandler.js:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Script/scriptHandler.js#L12)
