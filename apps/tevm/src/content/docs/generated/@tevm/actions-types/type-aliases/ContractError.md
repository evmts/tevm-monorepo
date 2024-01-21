---
editUrl: false
next: false
prev: false
title: "ContractError"
---

> **ContractError**: [`BaseCallError`](/generated/tevm/actions-types/type-aliases/basecallerror/) \| [`InvalidAddressError`](/generated/tevm/actions-types/type-aliases/invalidaddresserror/) \| [`EvmError`](/generated/tevm/actions-types/type-aliases/evmerror/) \| [`InvalidRequestError`](/generated/tevm/actions-types/type-aliases/invalidrequesterror/) \| [`UnexpectedError`](/generated/tevm/actions-types/type-aliases/unexpectederror/) \| `InvalidAbiError` \| [`InvalidDataError`](/generated/tevm/actions-types/type-aliases/invaliddataerror/) \| [`InvalidFunctionNameError`](/generated/tevm/actions-types/type-aliases/invalidfunctionnameerror/) \| `InvalidArgsError` \| `DecodeFunctionDataError` \| `EncodeFunctionReturnDataError`

Errors returned by contract tevm procedure

## Example

```ts
const {errors} = await tevm.contract({address: '0x1234'})
if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
}
```

## Source

[errors/ContractError.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/errors/ContractError.ts#L21)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
