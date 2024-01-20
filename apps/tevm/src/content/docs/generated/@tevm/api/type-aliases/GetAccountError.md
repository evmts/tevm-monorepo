---
editUrl: false
next: false
prev: false
title: "GetAccountError"
---

> **GetAccountError**: [`AccountNotFoundError`](/generated/tevm/api/type-aliases/accountnotfounderror/) \| [`InvalidAddressError`](/generated/tevm/api/type-aliases/invalidaddresserror/) \| [`InvalidRequestError`](/generated/tevm/api/type-aliases/invalidrequesterror/) \| [`UnexpectedError`](/generated/tevm/api/type-aliases/unexpectederror/)

Errors returned by tevm_getAccount procedure

## Example

```ts
const {errors} = await tevm.getAccount({address: '0x1234'})

if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
  console.log(errors[0].message) // Invalid address: 0x1234
}
```

## Source

[errors/GetAccountError.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/GetAccountError.ts#L16)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
