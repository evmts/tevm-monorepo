---
editUrl: false
next: false
prev: false
title: "GetAccountHandler"
---

> **GetAccountHandler**: (`params`) => `Promise`\<[`GetAccountResult`](/reference/tevm/actions/type-aliases/getaccountresult/)\>

Gets the state of a specific ethereum address

## Example

```ts
const res = tevm.getAccount({address: '0x123...'})
console.log(res.deployedBytecode)
console.log(res.nonce)
console.log(res.balance)
```

## Parameters

• **params**: [`GetAccountParams`](/reference/tevm/actions/type-aliases/getaccountparams/)

## Returns

`Promise`\<[`GetAccountResult`](/reference/tevm/actions/type-aliases/getaccountresult/)\>

## Defined in

[packages/actions/src/GetAccount/GetAccountHandlerType.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountHandlerType.ts#L12)
