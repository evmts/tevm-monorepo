**@tevm/api** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > DumpStateError

# Type alias: DumpStateError

> **DumpStateError**: [`InvalidRequestError`](InvalidRequestError.md) \| [`UnexpectedError`](UnexpectedError.md)

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

[errors/DumpStateError.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/DumpStateError.ts#L14)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
