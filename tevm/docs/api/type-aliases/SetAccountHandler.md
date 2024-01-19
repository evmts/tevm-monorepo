**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [api](../README.md) > SetAccountHandler

# Type alias: SetAccountHandler

> **SetAccountHandler**: (`params`) => `Promise`\<[`SetAccountResult`](../../index/type-aliases/SetAccountResult.md)\>

Sets the state of a specific ethereum address

## Parameters

▪ **params**: [`SetAccountParams`](../../index/type-aliases/SetAccountParams.md)

## Returns

## Example

```ts
import {parseEther} from 'tevm'

await tevm.setAccount({
 address: '0x123...',
 deployedBytecode: '0x6080604...',
 balance: parseEther('1.0')
})
```

## Source

vm/api/dist/index.d.ts:974

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
