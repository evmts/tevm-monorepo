[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [actions-types](../README.md) / GetAccountHandler

# Type alias: GetAccountHandler()

> **GetAccountHandler**: (`params`) => `Promise`\<[`GetAccountResult`](../../index/type-aliases/GetAccountResult.md)\>

Gets the state of a specific ethereum address

## Example

```ts
const res = tevm.getAccount({address: '0x123...'})
console.log(res.deployedBytecode)
console.log(res.nonce)
console.log(res.balance)
```

## Parameters

• **params**: [`GetAccountParams`](../../index/type-aliases/GetAccountParams.md)

## Returns

`Promise`\<[`GetAccountResult`](../../index/type-aliases/GetAccountResult.md)\>

## Source

packages/actions-types/types/handlers/GetAccountHandler.d.ts:10
