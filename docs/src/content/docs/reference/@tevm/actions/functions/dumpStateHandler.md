---
editUrl: false
next: false
prev: false
title: "dumpStateHandler"
---

> **dumpStateHandler**(`client`, `options`?): [`DumpStateHandler`](/reference/tevm/actions/type-aliases/dumpstatehandler/)

## Parameters

• **client**: `BaseClient`\<`"fork"` \| `"normal"`, `object`\>

The TEVM client instance.

• **options?** = `{}`

Optional settings.

• **options.throwOnFail?**: `undefined` \| `boolean`

Whether to throw an error if the state dump fails.

## Returns

[`DumpStateHandler`](/reference/tevm/actions/type-aliases/dumpstatehandler/)

- The state dump handler function.

## Defined in

[packages/actions/src/DumpState/dumpStateHandler.js:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/DumpState/dumpStateHandler.js#L30)
