---
editUrl: false
next: false
prev: false
title: "DumpStateHandler"
---

> **DumpStateHandler**: () => `Promise`\<[`DumpStateResult`](/generated/tevm/api/type-aliases/dumpstateresult/)\>

Handler for dumpState tevm procedure. Dumps the entire state into a [DumpStateResult](/generated/tevm/api/type-aliases/dumpstateresult/)

## Example

```ts
const {errors, state} = await tevm.dumpState()
```

## Source

[handlers/DumpStateHandler.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/DumpStateHandler.ts#L8)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
