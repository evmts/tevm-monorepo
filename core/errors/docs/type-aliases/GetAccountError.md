**@tevm/errors** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > GetAccountError

# Type alias: GetAccountError

> **GetAccountError**: [`AccountNotFoundError`](AccountNotFoundError.md) \| [`InvalidAddressError`](InvalidAddressError.md) \| [`InvalidRequestError`](InvalidRequestError.md) \| [`UnexpectedError`](UnexpectedError.md)

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

[core/errors/src/GetAccountError.ts:16](https://github.com/evmts/tevm-monorepo/blob/main/core/errors/src/GetAccountError.ts#L16)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
