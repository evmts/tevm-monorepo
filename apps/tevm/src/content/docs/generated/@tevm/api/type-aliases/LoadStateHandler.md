---
editUrl: false
next: false
prev: false
title: "LoadStateHandler"
---

> **LoadStateHandler**: (`params`) => `Promise`\<`LoadStateResult`\>

Handler for load state tevm procedure

## Example

```ts
const {errors} = await tevm.loadState({ state: { '0x....': '0x....' } })
```

## Parameters

▪ **params**: [`LoadStateParams`](/generated/tevm/api/type-aliases/loadstateparams/)

## Source

[handlers/LoadStateHandler.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/LoadStateHandler.ts#L9)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
