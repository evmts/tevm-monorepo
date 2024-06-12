---
editUrl: false
next: false
prev: false
title: "GetAccountHandler"
---

> **GetAccountHandler**: (`params`) => `Promise`\<[`GetAccountResult`](/reference/tevm/actions/type-aliases/getaccountresult-1/)\>

Gets the state of a specific ethereum address

## Example

```ts
const res = tevm.getAccount({address: '0x123...'})
console.log(res.deployedBytecode)
console.log(res.nonce)
console.log(res.balance)
```

## Parameters

• **params**: [`GetAccountParams`](/reference/tevm/actions/type-aliases/getaccountparams-1/)

## Returns

`Promise`\<[`GetAccountResult`](/reference/tevm/actions/type-aliases/getaccountresult-1/)\>

## Source

[packages/actions/src/GetAccount/GetAccountHandlerType.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountHandlerType.ts#L12)
