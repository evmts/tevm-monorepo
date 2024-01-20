---
editUrl: false
next: false
prev: false
title: "CallParams"
---

> **CallParams**: [`BaseCallParams`](/generated/tevm/api/type-aliases/basecallparams/) & `object`

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

### data

> **data**?: `Hex`

The input data.

### deployedBytecode

> **deployedBytecode**?: `Hex`

The EVM code to run.

### salt

> **salt**?: `Hex`

An optional CREATE2 salt.

## Source

[params/CallParams.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/params/CallParams.ts#L16)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
