**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [actions-types](../README.md) > SetAccountHandler

# Type alias: SetAccountHandler

> **SetAccountHandler**: (`params`) => `Promise`\<[`SetAccountResult`](../../index/type-aliases/SetAccountResult.md)\>

Sets the state of a specific ethereum address

## Example

```ts
import {parseEther} from 'tevm'

await tevm.setAccount({
 address: '0x123...',
 deployedBytecode: '0x6080604...',
 balance: parseEther('1.0')
})
```

## Parameters

▪ **params**: [`SetAccountParams`](../../index/type-aliases/SetAccountParams.md)

## Source

packages/actions-types/types/handlers/SetAccountHandler.d.ts:13

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
