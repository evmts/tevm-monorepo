---
editUrl: false
next: false
prev: false
title: "GetAccountError"
---

> **GetAccountError**: [`InvalidAddressError`](/generated/type-aliases/invalidaddresserror/) \| [`InvalidRequestError`](/generated/type-aliases/invalidrequesterror/) \| [`UnexpectedError`](/generated/type-aliases/unexpectederror/)

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

[errors/GetAccountError.ts:15](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/GetAccountError.ts#L15)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
