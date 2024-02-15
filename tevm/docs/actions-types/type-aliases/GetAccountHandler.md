**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [actions-types](../README.md) > GetAccountHandler

# Type alias: GetAccountHandler

> **GetAccountHandler**: (`params`) => `Promise`\<[`GetAccountResult`](../../index/type-aliases/GetAccountResult.md)\>

Gets the state of a specific ethereum address

## Parameters

▪ **params**: [`GetAccountParams`](../../index/type-aliases/GetAccountParams.md)

## Returns

## Example

```ts
const res = tevm.getAccount({address: '0x123...'})
console.log(res.deployedBytecode)
console.log(res.nonce)
console.log(res.balance)
```

## Source

packages/actions-types/types/handlers/GetAccountHandler.d.ts:10

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
