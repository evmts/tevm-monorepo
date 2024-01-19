---
editUrl: false
next: false
prev: false
title: "GetAccountHandler"
---

> **GetAccountHandler**: (`params`) => `Promise`\<[`GetAccountResult`](/generated/tevm/api/type-aliases/getaccountresult/)\>

Gets the state of a specific ethereum address

## Parameters

▪ **params**: [`GetAccountParams`](/generated/tevm/api/type-aliases/getaccountparams/)

## Returns

## Example

```ts
const res = tevm.getAccount({address: '0x123...'})
console.log(res.deployedBytecode)
console.log(res.nonce)
console.log(res.balance)
```

## Source

[handlers/GetAccountHandler.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/GetAccountHandler.ts#L11)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
