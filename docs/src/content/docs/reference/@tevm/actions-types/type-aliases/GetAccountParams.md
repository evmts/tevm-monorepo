---
editUrl: false
next: false
prev: false
title: "GetAccountParams"
---

> **GetAccountParams**\<`TThrowOnFail`\>: `BaseParams`\<`TThrowOnFail`\> & `object`

Tevm params to get an account

## Example

```ts
const getAccountParams: import('@tevm/api').GetAccountParams = {
  address: '0x...',
}
```

## Type declaration

### address

> **address**: [`Address`](/reference/tevm/actions-types/type-aliases/address/)

Address of account

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TThrowOnFail` extends `boolean` | `boolean` |

## Source

[params/GetAccountParams.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/GetAccountParams.ts#L11)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
