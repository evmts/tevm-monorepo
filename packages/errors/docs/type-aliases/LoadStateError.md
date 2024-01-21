**@tevm/errors** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > LoadStateError

# Type alias: LoadStateError

> **LoadStateError**: [`InvalidRequestError`](InvalidRequestError.md) \| [`UnexpectedError`](UnexpectedError.md)

Error Returned by load state procedure

## Example

```ts
const {errors} = await tevm.loadState()

if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
  console.log(errors[0].message) // Invalid address: 0x1234
}
```

## Source

[packages/errors/src/actions/LoadStateError.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/actions/LoadStateError.ts#L14)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
