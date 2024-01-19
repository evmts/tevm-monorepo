---
editUrl: false
next: false
prev: false
title: "ContractError"
---

> **ContractError**: [`BaseCallError`](/generated/type-aliases/basecallerror/) \| [`InvalidAddressError`](/generated/type-aliases/invalidaddresserror/) \| [`EvmError`](/generated/type-aliases/evmerror/) \| [`InvalidRequestError`](/generated/type-aliases/invalidrequesterror/) \| [`UnexpectedError`](/generated/type-aliases/unexpectederror/) \| `InvalidAbiError` \| [`InvalidDataError`](/generated/type-aliases/invaliddataerror/) \| [`InvalidFunctionNameError`](/generated/type-aliases/invalidfunctionnameerror/) \| `InvalidArgsError` \| `DecodeFunctionDataError` \| `EncodeFunctionReturnDataError`

Errors returned by contract tevm procedure

## Example

```ts
const {errors} = await tevm.contract({address: '0x1234'})
if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
}
```

## Source

vm/api/dist/index.d.ts:891

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
