---
editUrl: false
next: false
prev: false
title: "ContractError"
---

> **ContractError**: [`BaseCallError`](/generated/tevm/api/type-aliases/basecallerror/) \| [`InvalidAddressError`](/generated/tevm/api/type-aliases/invalidaddresserror/) \| [`EvmError`](/generated/tevm/api/type-aliases/evmerror/) \| [`InvalidRequestError`](/generated/tevm/api/type-aliases/invalidrequesterror/) \| [`UnexpectedError`](/generated/tevm/api/type-aliases/unexpectederror/) \| `InvalidAbiError` \| [`InvalidDataError`](/generated/tevm/api/type-aliases/invaliddataerror/) \| [`InvalidFunctionNameError`](/generated/tevm/api/type-aliases/invalidfunctionnameerror/) \| `InvalidArgsError` \| `DecodeFunctionDataError` \| `EncodeFunctionReturnDataError`

Errors returned by contract tevm procedure

## Example

```ts
const {errors} = await tevm.contract({address: '0x1234'})
if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
}
```

## Source

[errors/ContractError.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/ContractError.ts#L21)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
