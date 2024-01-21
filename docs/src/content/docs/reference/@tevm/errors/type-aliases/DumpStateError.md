---
editUrl: false
next: false
prev: false
title: "DumpStateError"
---

> **DumpStateError**: [`InvalidRequestError`](/reference/tevm/errors/type-aliases/invalidrequesterror/) \| [`UnexpectedError`](/reference/tevm/errors/type-aliases/unexpectederror/)

Error Returned by dump state procedure

## Example

```ts
const {errors} = await tevm.dumpState()

if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
  console.log(errors[0].message) // Invalid address: 0x1234
}
```

## Source

[packages/errors/src/actions/DumpStateError.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/actions/DumpStateError.ts#L14)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
