---
editUrl: false
next: false
prev: false
title: "ContractError"
---

> **ContractError**: [`BaseCallError`](/generated/tevm/errors/type-aliases/basecallerror/) \| [`InvalidAddressError`](/generated/tevm/errors/type-aliases/invalidaddresserror/) \| [`EvmError`](/generated/tevm/errors/type-aliases/evmerror/) \| [`InvalidRequestError`](/generated/tevm/errors/type-aliases/invalidrequesterror/) \| [`UnexpectedError`](/generated/tevm/errors/type-aliases/unexpectederror/) \| `InvalidAbiError` \| [`InvalidDataError`](/generated/tevm/errors/type-aliases/invaliddataerror/) \| [`InvalidFunctionNameError`](/generated/tevm/errors/type-aliases/invalidfunctionnameerror/) \| `InvalidArgsError` \| `DecodeFunctionDataError` \| `EncodeFunctionReturnDataError`

Errors returned by contract tevm procedure

## Example

```ts
const {errors} = await tevm.contract({address: '0x1234'})
if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
}
```

## Source

[packages/errors/src/ContractError.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ContractError.ts#L21)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
