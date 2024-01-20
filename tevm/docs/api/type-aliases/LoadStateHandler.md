**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [api](../README.md) > LoadStateHandler

# Type alias: LoadStateHandler

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

▪ **params**: `LoadStateParams`

## Source

vm/api/types/handlers/LoadStateHandler.d.ts:20

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
