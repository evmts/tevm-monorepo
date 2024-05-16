---
editUrl: false
next: false
prev: false
title: "LoadStateHandler"
---

> **LoadStateHandler**: (`params`) => `Promise`\<[`LoadStateResult`](/reference/tevm/actions-types/type-aliases/loadstateresult/)\>

Loads a previously dumped state into the VM

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

• **params**: [`LoadStateParams`](/reference/tevm/actions-types/type-aliases/loadstateparams/)

## Returns

`Promise`\<[`LoadStateResult`](/reference/tevm/actions-types/type-aliases/loadstateresult/)\>

## Source

[handlers/LoadStateHandler.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/LoadStateHandler.ts#L21)
