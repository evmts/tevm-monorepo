**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > SetAccountError

# Type alias: SetAccountError

> **SetAccountError**: [`InvalidAddressError`](../../api/type-aliases/InvalidAddressError.md) \| [`InvalidBalanceError`](../../api/type-aliases/InvalidBalanceError.md) \| [`InvalidNonceError`](../../api/type-aliases/InvalidNonceError.md) \| [`InvalidStorageRootError`](../../api/type-aliases/InvalidStorageRootError.md) \| [`InvalidBytecodeError`](../../api/type-aliases/InvalidBytecodeError.md) \| [`InvalidRequestError`](../../api/type-aliases/InvalidRequestError.md) \| [`UnexpectedError`](../../api/type-aliases/UnexpectedError.md)

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

vm/api/types/errors/SetAccountError.d.ts:18

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
