---
editUrl: false
next: false
prev: false
title: "SetAccountError"
---

> **SetAccountError**: [`InvalidAddressError`](/reference/tevm/errors/type-aliases/invalidaddresserror/) \| [`InvalidBalanceError`](/reference/tevm/errors/type-aliases/invalidbalanceerror/) \| [`InvalidNonceError`](/reference/tevm/errors/type-aliases/invalidnonceerror/) \| [`InvalidStorageRootError`](/reference/tevm/errors/type-aliases/invalidstoragerooterror/) \| [`InvalidBytecodeError`](/reference/tevm/errors/type-aliases/invalidbytecodeerror/) \| [`InvalidRequestError`](/reference/tevm/errors/type-aliases/invalidrequesterror/) \| [`UnexpectedError`](/reference/tevm/errors/type-aliases/unexpectederror/)

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

[packages/errors/src/actions/SetAccountError.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/actions/SetAccountError.ts#L21)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
