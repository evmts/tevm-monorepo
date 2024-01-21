---
editUrl: false
next: false
prev: false
title: "SetAccountError"
---

> **SetAccountError**: [`InvalidAddressError`](/generated/tevm/actions-types/type-aliases/invalidaddresserror/) \| [`InvalidBalanceError`](/generated/tevm/actions-types/type-aliases/invalidbalanceerror/) \| [`InvalidNonceError`](/generated/tevm/actions-types/type-aliases/invalidnonceerror/) \| [`InvalidStorageRootError`](/generated/tevm/actions-types/type-aliases/invalidstoragerooterror/) \| [`InvalidBytecodeError`](/generated/tevm/actions-types/type-aliases/invalidbytecodeerror/) \| [`InvalidRequestError`](/generated/tevm/actions-types/type-aliases/invalidrequesterror/) \| [`UnexpectedError`](/generated/tevm/actions-types/type-aliases/unexpectederror/)

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

[errors/SetAccountError.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/errors/SetAccountError.ts#L19)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
