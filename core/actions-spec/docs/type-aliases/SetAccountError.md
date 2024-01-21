**@tevm/api** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > SetAccountError

# Type alias: SetAccountError

> **SetAccountError**: [`InvalidAddressError`](InvalidAddressError.md) \| [`InvalidBalanceError`](InvalidBalanceError.md) \| [`InvalidNonceError`](InvalidNonceError.md) \| [`InvalidStorageRootError`](InvalidStorageRootError.md) \| [`InvalidBytecodeError`](InvalidBytecodeError.md) \| [`InvalidRequestError`](InvalidRequestError.md) \| [`UnexpectedError`](UnexpectedError.md)

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
