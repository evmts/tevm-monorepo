---
editUrl: false
next: false
prev: false
title: "DumpStateHandler"
---

> **DumpStateHandler**: () => `Promise`\<[`DumpStateResult`](/generated/tevm/api/type-aliases/dumpstateresult/)\>

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

## Source

[handlers/DumpStateHandler.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/DumpStateHandler.ts#L20)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
