**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [api](../README.md) > LoadStateHandler

# Type alias: LoadStateHandler

> **LoadStateHandler**: (`params`) => `Promise`\<`LoadStateResult`\>

Handler for load state tevm procedure

## Example

```ts
const {errors} = await tevm.loadState({ state: { '0x....': '0x....' } })
```

## Parameters

▪ **params**: `LoadStateParams`

## Source

vm/api/types/handlers/LoadStateHandler.d.ts:8

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
