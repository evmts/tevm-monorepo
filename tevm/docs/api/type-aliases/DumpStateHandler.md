**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [api](../README.md) > DumpStateHandler

# Type alias: DumpStateHandler

> **DumpStateHandler**: () => `Promise`\<[`DumpStateResult`](DumpStateResult.md)\>

Handler for dumpState tevm procedure. Dumps the entire state into a [DumpStateResult](DumpStateResult.md)

## Example

```ts
const {errors, state} = await tevm.dumpState()
```

## Source

vm/api/types/handlers/DumpStateHandler.d.ts:7

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
