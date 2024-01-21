**@tevm/api** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ContractError

# Type alias: ContractError

> **ContractError**: [`BaseCallError`](BaseCallError.md) \| [`InvalidAddressError`](InvalidAddressError.md) \| [`EvmError`](EvmError.md) \| [`InvalidRequestError`](InvalidRequestError.md) \| [`UnexpectedError`](UnexpectedError.md) \| `InvalidAbiError` \| [`InvalidDataError`](InvalidDataError.md) \| [`InvalidFunctionNameError`](InvalidFunctionNameError.md) \| `InvalidArgsError` \| `DecodeFunctionDataError` \| `EncodeFunctionReturnDataError`

Errors returned by contract tevm procedure

## Example

```ts
const {errors} = await tevm.contract({address: '0x1234'})
if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
}
```

## Source

[errors/ContractError.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/errors/ContractError.ts#L21)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
