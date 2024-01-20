**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > GetAccountError

# Type alias: GetAccountError

> **GetAccountError**: [`AccountNotFoundError`](../../api/type-aliases/AccountNotFoundError.md) \| [`InvalidAddressError`](../../api/type-aliases/InvalidAddressError.md) \| [`InvalidRequestError`](../../api/type-aliases/InvalidRequestError.md) \| [`UnexpectedError`](../../api/type-aliases/UnexpectedError.md)

Errors returned by tevm_getAccount procedure

## Example

```ts
const {errors} = await tevm.getAccount({address: '0x1234'})

if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
  console.log(errors[0].message) // Invalid address: 0x1234
}
```

## Source

vm/api/types/errors/GetAccountError.d.ts:15

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
