**@tevm/actions-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > SetAccountHandler

# Type alias: SetAccountHandler

> **SetAccountHandler**: (`params`) => `Promise`\<[`SetAccountResult`](SetAccountResult.md)\>

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

▪ **params**: [`SetAccountParams`](SetAccountParams.md)

## Source

[handlers/SetAccountHandler.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/SetAccountHandler.ts#L14)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
