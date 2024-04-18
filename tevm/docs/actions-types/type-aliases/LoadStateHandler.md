**tevm** • [Readme](../../README.md) \| [API](../../modules.md)

***

[tevm](../../README.md) / [actions-types](../README.md) / LoadStateHandler

# Type alias: LoadStateHandler()

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

• **params**: [`LoadStateParams`](LoadStateParams.md)

## Returns

`Promise`\<[`LoadStateResult`](LoadStateResult.md)\>

## Source

packages/actions-types/types/handlers/LoadStateHandler.d.ts:20
