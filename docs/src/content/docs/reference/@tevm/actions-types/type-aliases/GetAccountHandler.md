---
editUrl: false
next: false
prev: false
title: "GetAccountHandler"
---

> **GetAccountHandler**: (`params`) => `Promise`\<[`GetAccountResult`](/reference/tevm/actions-types/type-aliases/getaccountresult/)\>

Gets the state of a specific ethereum address

## Example

```ts
const res = tevm.getAccount({address: '0x123...'})
console.log(res.deployedBytecode)
console.log(res.nonce)
console.log(res.balance)
```

## Parameters

• **params**: [`GetAccountParams`](/reference/tevm/actions-types/type-aliases/getaccountparams/)

## Returns

`Promise`\<[`GetAccountResult`](/reference/tevm/actions-types/type-aliases/getaccountresult/)\>

## Source

[handlers/GetAccountHandler.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/GetAccountHandler.ts#L11)
