**@tevm/actions-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > GetAccountHandler

# Type alias: GetAccountHandler

> **GetAccountHandler**: (`params`) => `Promise`\<[`GetAccountResult`](GetAccountResult.md)\>

Gets the state of a specific ethereum address

## Example

```ts
const res = tevm.getAccount({address: '0x123...'})
console.log(res.deployedBytecode)
console.log(res.nonce)
console.log(res.balance)
```

## Parameters

▪ **params**: [`GetAccountParams`](GetAccountParams.md)

## Source

[handlers/GetAccountHandler.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/GetAccountHandler.ts#L11)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
