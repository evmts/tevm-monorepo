[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / DumpStateHandler

# Type Alias: DumpStateHandler()

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

• **params?**: [`BaseParams`](BaseParams.md)

## Returns

`Promise`\<[`DumpStateResult`](DumpStateResult.md)\>

## Defined in

[packages/actions/src/DumpState/DumpStateHandlerType.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/DumpState/DumpStateHandlerType.ts#L21)
