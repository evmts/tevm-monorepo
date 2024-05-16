[**@tevm/actions-types**](../README.md) • **Docs**

***

[@tevm/actions-types](../globals.md) / DumpStateHandler

# Type alias: DumpStateHandler()

> **DumpStateHandler**: (`params`?) => `Promise`\<[`DumpStateResult`](DumpStateResult.md)\>

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

• **params?**: `BaseParams`

## Returns

`Promise`\<[`DumpStateResult`](DumpStateResult.md)\>

## Source

[handlers/DumpStateHandler.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/DumpStateHandler.ts#L21)
