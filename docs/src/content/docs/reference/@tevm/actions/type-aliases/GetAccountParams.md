---
editUrl: false
next: false
prev: false
title: "GetAccountParams"
---

> **GetAccountParams**\<`TThrowOnFail`\>: [`BaseParams`](/reference/tevm/actions/type-aliases/baseparams/)\<`TThrowOnFail`\> & `object`

Tevm params to get an account

## Example

```ts
const getAccountParams: import('@tevm/api').GetAccountParams = {
  address: '0x...',
}
```

## Type declaration

### address

> `readonly` **address**: [`Address`](/reference/tevm/actions/type-aliases/address/)

Address of account

### returnStorage?

> `optional` `readonly` **returnStorage**: `boolean`

If true the handler will return the contract storage
It only returns storage that happens to be cached in the vm
In fork mode if storage hasn't yet been cached it will not be returned
This defaults to false
Be aware that this can be very expensive if a contract has a lot of storage

## Type parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Source

[packages/actions/src/GetAccount/GetAccountParams.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountParams.ts#L11)
