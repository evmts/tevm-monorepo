**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [actions-types](../README.md) > DumpStateHandler

# Type alias: DumpStateHandler

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

▪ **params?**: `BaseParams`

## Source

packages/actions-types/types/handlers/DumpStateHandler.d.ts:20

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
