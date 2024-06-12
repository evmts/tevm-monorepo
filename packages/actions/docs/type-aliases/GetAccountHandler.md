[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / GetAccountHandler

# Type alias: GetAccountHandler()

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

• **params**: [`GetAccountParams`](GetAccountParams.md)

## Returns

`Promise`\<[`GetAccountResult`](GetAccountResult.md)\>

## Source

[packages/actions/src/GetAccount/GetAccountHandlerType.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountHandlerType.ts#L12)
