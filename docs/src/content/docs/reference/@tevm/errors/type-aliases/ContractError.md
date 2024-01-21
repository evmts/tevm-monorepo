---
editUrl: false
next: false
prev: false
title: "ContractError"
---

> **ContractError**: [`BaseCallError`](/reference/tevm/errors/type-aliases/basecallerror/) \| [`InvalidAddressError`](/reference/tevm/errors/type-aliases/invalidaddresserror/) \| [`EvmError`](/reference/tevm/errors/type-aliases/evmerror/) \| [`InvalidRequestError`](/reference/tevm/errors/type-aliases/invalidrequesterror/) \| [`UnexpectedError`](/reference/tevm/errors/type-aliases/unexpectederror/) \| [`InvalidAbiError`](/reference/tevm/errors/type-aliases/invalidabierror/) \| [`InvalidDataError`](/reference/tevm/errors/type-aliases/invaliddataerror/) \| [`InvalidFunctionNameError`](/reference/tevm/errors/type-aliases/invalidfunctionnameerror/) \| [`InvalidArgsError`](/reference/tevm/errors/type-aliases/invalidargserror/) \| [`DecodeFunctionDataError`](/reference/tevm/errors/type-aliases/decodefunctiondataerror/) \| [`EncodeFunctionReturnDataError`](/reference/tevm/errors/type-aliases/encodefunctionreturndataerror/)

Errors returned by contract tevm procedure

## Example

```ts
const {errors} = await tevm.contract({address: '0x1234'})
if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
}
```

## Source

[packages/errors/src/actions/ContractError.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/actions/ContractError.ts#L25)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
