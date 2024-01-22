**@tevm/errors** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ContractError

# Type alias: ContractError

> **ContractError**: [`BaseCallError`](BaseCallError.md) \| [`InvalidAddressError`](InvalidAddressError.md) \| [`EvmError`](EvmError.md) \| [`InvalidRequestError`](InvalidRequestError.md) \| [`UnexpectedError`](UnexpectedError.md) \| [`InvalidAbiError`](InvalidAbiError.md) \| [`InvalidDataError`](InvalidDataError.md) \| [`InvalidFunctionNameError`](InvalidFunctionNameError.md) \| [`InvalidArgsError`](InvalidArgsError.md) \| [`DecodeFunctionDataError`](DecodeFunctionDataError.md) \| [`EncodeFunctionReturnDataError`](EncodeFunctionReturnDataError.md)

Errors returned by contract tevm procedure

## Example

```ts
const {errors} = await tevm.contract({address: '0x1234'})
if (errors?.length) {
  console.log(errors[0].name) // InvalidAddressError
}
```

## Source

[packages/errors/src/actions/ContractError.ts:25](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/actions/ContractError.ts#L25)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
