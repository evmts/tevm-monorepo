---
editUrl: false
next: false
prev: false
title: "CallParams"
---

> **CallParams**\<`TThrowOnFail`\>: [`BaseCallParams`](/reference/tevm/actions/type-aliases/basecallparams/)\<`TThrowOnFail`\> & `object`

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

### code?

> `optional` `readonly` **code**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

alias for deployedBytecode

### data?

> `optional` `readonly` **data**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

The input data.

### deployedBytecode?

> `optional` `readonly` **deployedBytecode**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

The EVM code to run.

### salt?

> `optional` `readonly` **salt**: [`Hex`](/reference/tevm/actions/type-aliases/hex/)

An optional CREATE2 salt.

## Type parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Source

[packages/actions/src/Call/CallParams.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallParams.ts#L16)
