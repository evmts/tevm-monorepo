---
editUrl: false
next: false
prev: false
title: "CallParams"
---

> **CallParams**\<`TThrowOnFail`\>: [`BaseCallParams`](/reference/tevm/actions-types/type-aliases/basecallparams/)\<`TThrowOnFail`\> & `object`

Tevm params to execute a call on the vm
Call is the lowest level method to interact with the vm
and other messages such as contract and script are using call
under the hood

## Example

```ts
const callParams: import('@tevm/api').CallParams = {
  data: '0x...',
  bytecode: '0x...',
  gasLimit: 420n,
}
```

## Type declaration

### data?

> `optional` **data**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

The input data.

### deployedBytecode?

> `optional` **deployedBytecode**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

The EVM code to run.

### salt?

> `optional` **salt**: [`Hex`](/reference/tevm/actions-types/type-aliases/hex/)

An optional CREATE2 salt.

## Type parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Source

[params/CallParams.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/CallParams.ts#L16)
