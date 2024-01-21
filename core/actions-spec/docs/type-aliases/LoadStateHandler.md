**@tevm/actions-spec** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > LoadStateHandler

# Type alias: LoadStateHandler

> **LoadStateHandler**: (`params`) => `Promise`\<[`LoadStateResult`](LoadStateResult.md)\>

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

▪ **params**: [`LoadStateParams`](LoadStateParams.md)

## Source

[handlers/LoadStateHandler.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/core/actions-spec/src/handlers/LoadStateHandler.ts#L21)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
