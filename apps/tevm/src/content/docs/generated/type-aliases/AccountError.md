---
editUrl: false
next: false
prev: false
title: "AccountError"
---

> **AccountError**: [`InvalidAddressError`](/generated/type-aliases/invalidaddresserror/) \| [`InvalidBalanceError`](/generated/type-aliases/invalidbalanceerror/) \| [`InvalidNonceError`](/generated/type-aliases/invalidnonceerror/) \| [`InvalidStorageRootError`](/generated/type-aliases/invalidstoragerooterror/) \| [`InvalidBytecodeError`](/generated/type-aliases/invalidbytecodeerror/) \| [`InvalidRequestError`](/generated/type-aliases/invalidrequesterror/) \| [`UnexpectedError`](/generated/type-aliases/unexpectederror/)

Errors returned by account tevm procedure

## Example

```ts
const {errors} = await tevm.account({address: '0x1234'})

if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
  console.log(errors[0].message) // Invalid address: 0x1234
}
```

## Source

[errors/AccountError.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/AccountError.ts#L19)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
