---
editUrl: false
next: false
prev: false
title: "GetAccountError"
---

> **GetAccountError**: [`AccountNotFoundError`](/generated/tevm/errors/type-aliases/accountnotfounderror/) \| [`InvalidAddressError`](/generated/tevm/errors/type-aliases/invalidaddresserror/) \| [`InvalidRequestError`](/generated/tevm/errors/type-aliases/invalidrequesterror/) \| [`UnexpectedError`](/generated/tevm/errors/type-aliases/unexpectederror/)

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

[packages/errors/src/GetAccountError.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/GetAccountError.ts#L16)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
