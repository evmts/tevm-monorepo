---
editUrl: false
next: false
prev: false
title: "LoadStateHandler"
---

> **LoadStateHandler**: (`params`) => `Promise`\<`LoadStateResult`\>

Loads a previously dumped state into the VM

State can be dumped as follows

## Example

```typescript
const {state} = await tevm.dumpState()
fs.writeFileSync('state.json', JSON.stringify(state))
```

And then loaded as follows

## Example

```typescript
const state = JSON.parse(fs.readFileSync('state.json'))
await tevm.loadState({state})
```

## Parameters

▪ **params**: [`LoadStateParams`](/generated/tevm/api/type-aliases/loadstateparams/)

## Source

[handlers/LoadStateHandler.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/LoadStateHandler.ts#L21)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
