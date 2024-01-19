---
editUrl: false
next: false
prev: false
title: "SetAccountError"
---

> **SetAccountError**: [`InvalidAddressError`](/generated/type-aliases/invalidaddresserror/) \| [`InvalidBalanceError`](/generated/type-aliases/invalidbalanceerror/) \| [`InvalidNonceError`](/generated/type-aliases/invalidnonceerror/) \| [`InvalidStorageRootError`](/generated/type-aliases/invalidstoragerooterror/) \| [`InvalidBytecodeError`](/generated/type-aliases/invalidbytecodeerror/) \| [`InvalidRequestError`](/generated/type-aliases/invalidrequesterror/) \| [`UnexpectedError`](/generated/type-aliases/unexpectederror/)

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

vm/api/dist/index.d.ts:931

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
