**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > ContractError

# Type alias: ContractError

> **ContractError**: [`BaseCallError`](../../api/type-aliases/BaseCallError.md) \| [`InvalidAddressError`](../../api/type-aliases/InvalidAddressError.md) \| [`EvmError`](../../api/type-aliases/EvmError.md) \| [`InvalidRequestError`](../../api/type-aliases/InvalidRequestError.md) \| [`UnexpectedError`](../../api/type-aliases/UnexpectedError.md) \| `InvalidAbiError` \| [`InvalidDataError`](../../api/type-aliases/InvalidDataError.md) \| [`InvalidFunctionNameError`](../../api/type-aliases/InvalidFunctionNameError.md) \| `InvalidArgsError` \| `DecodeFunctionDataError` \| `EncodeFunctionReturnDataError`

Errors returned by contract tevm procedure

## Example

```ts
const {errors} = await tevm.contract({address: '0x1234'})
if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
}
```

## Source

vm/api/types/errors/ContractError.d.ts:20

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
