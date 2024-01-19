---
editUrl: false
next: false
prev: false
title: "SetAccountError"
---

> **SetAccountError**: [`InvalidAddressError`](/generated/tevm/api/type-aliases/invalidaddresserror/) \| [`InvalidBalanceError`](/generated/tevm/api/type-aliases/invalidbalanceerror/) \| [`InvalidNonceError`](/generated/tevm/api/type-aliases/invalidnonceerror/) \| [`InvalidStorageRootError`](/generated/tevm/api/type-aliases/invalidstoragerooterror/) \| [`InvalidBytecodeError`](/generated/tevm/api/type-aliases/invalidbytecodeerror/) \| [`InvalidRequestError`](/generated/tevm/api/type-aliases/invalidrequesterror/) \| [`UnexpectedError`](/generated/tevm/api/type-aliases/unexpectederror/)

Errors returned by tevm_setAccount method

## Example

```ts
const {errors} = await tevm.setAccount({address: '0x1234'})

if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
  console.log(errors[0].message) // Invalid address: 0x1234
}
```

## Source

[errors/SetAccountError.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/SetAccountError.ts#L19)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
