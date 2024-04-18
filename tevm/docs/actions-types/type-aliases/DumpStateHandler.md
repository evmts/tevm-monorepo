**tevm** • [Readme](../../README.md) \| [API](../../modules.md)

***

[tevm](../../README.md) / [actions-types](../README.md) / DumpStateHandler

# Type alias: DumpStateHandler()

> **DumpStateHandler**: (`params`?) => `Promise`\<[`DumpStateResult`](DumpStateResult.md)\>

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

• **params?**: `BaseParams`

## Returns

`Promise`\<[`DumpStateResult`](DumpStateResult.md)\>

## Source

packages/actions-types/types/handlers/DumpStateHandler.d.ts:20
