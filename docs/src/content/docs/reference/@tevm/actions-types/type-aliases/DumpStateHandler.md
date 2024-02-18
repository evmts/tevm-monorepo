---
editUrl: false
next: false
prev: false
title: "DumpStateHandler"
---

> **DumpStateHandler**: (`params`?) => `Promise`\<[`DumpStateResult`](/reference/tevm/actions-types/type-aliases/dumpstateresult/)\>

Dumps the current state of the VM into a JSON-seralizable object

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

▪ **params?**: `BaseParams`

## Source

[handlers/DumpStateHandler.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/DumpStateHandler.ts#L21)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
