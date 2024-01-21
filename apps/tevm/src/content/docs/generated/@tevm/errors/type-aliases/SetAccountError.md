---
editUrl: false
next: false
prev: false
title: "SetAccountError"
---

> **SetAccountError**: [`InvalidAddressError`](/generated/tevm/errors/type-aliases/invalidaddresserror/) \| [`InvalidBalanceError`](/generated/tevm/errors/type-aliases/invalidbalanceerror/) \| [`InvalidNonceError`](/generated/tevm/errors/type-aliases/invalidnonceerror/) \| [`InvalidStorageRootError`](/generated/tevm/errors/type-aliases/invalidstoragerooterror/) \| [`InvalidBytecodeError`](/generated/tevm/errors/type-aliases/invalidbytecodeerror/) \| [`InvalidRequestError`](/generated/tevm/errors/type-aliases/invalidrequesterror/) \| [`UnexpectedError`](/generated/tevm/errors/type-aliases/unexpectederror/)

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

[packages/errors/src/SetAccountError.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/SetAccountError.ts#L19)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
