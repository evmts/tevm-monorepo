**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [actions-types](../README.md) > DumpStateHandler

# Type alias: DumpStateHandler

> **DumpStateHandler**: () => `Promise`\<`DumpStateResult`\>

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

## Source

packages/actions-types/types/handlers/DumpStateHandler.d.ts:19

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
