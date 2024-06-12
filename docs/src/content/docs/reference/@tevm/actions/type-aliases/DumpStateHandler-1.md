---
editUrl: false
next: false
prev: false
title: "DumpStateHandler"
---

> **DumpStateHandler**: (`params`?) => `Promise`\<[`DumpStateResult`](/reference/tevm/actions/type-aliases/dumpstateresult-1/)\>

Dumps the current state of the VM into a JSON-seralizable object

State can be dumped as follows

## Examples

```typescript
const {state} = await tevm.dumpState()
fs.writeFileSync('state.json', JSON.stringify(state))
```

And then loaded as follows

```typescript
const state = JSON.parse(fs.readFileSync('state.json'))
await tevm.loadState({state})
```

## Parameters

• **params?**: [`BaseParams`](/reference/tevm/actions/type-aliases/baseparams-1/)

## Returns

`Promise`\<[`DumpStateResult`](/reference/tevm/actions/type-aliases/dumpstateresult-1/)\>

## Source

[packages/actions/src/DumpState/DumpStateHandlerType.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/DumpState/DumpStateHandlerType.ts#L21)
