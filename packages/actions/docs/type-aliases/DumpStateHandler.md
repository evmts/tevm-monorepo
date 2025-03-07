[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DumpStateHandler

# Type Alias: DumpStateHandler()

> **DumpStateHandler**: (`params`?) => `Promise`\<[`DumpStateResult`](DumpStateResult.md)\>

Defined in: [packages/actions/src/DumpState/DumpStateHandlerType.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/DumpState/DumpStateHandlerType.ts#L29)

Dumps the current state of the VM into a JSON-serializable object.

This handler allows you to capture the entire state of the VM, which can be useful for
debugging, testing, or persisting the state across sessions.

## Parameters

### params?

[`DumpStateParams`](DumpStateParams.md)

Optional parameters to customize the state dumping process.

## Returns

`Promise`\<[`DumpStateResult`](DumpStateResult.md)\>

A promise that resolves to a `DumpStateResult` object containing the state data.

## Examples

```typescript
// Dumping the state
const { state } = await tevm.dumpState()
fs.writeFileSync('state.json', JSON.stringify(state))
```

```typescript
// Loading the state
const state = JSON.parse(fs.readFileSync('state.json'))
await tevm.loadState({ state })
```

## See

LoadStateHandler for loading the dumped state back into the VM.
