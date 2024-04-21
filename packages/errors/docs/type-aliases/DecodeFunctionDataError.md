**@tevm/errors** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > DecodeFunctionDataError

# Type alias: DecodeFunctionDataError

> **DecodeFunctionDataError**: [`TypedError`](TypedError.md)\<`"DecodeFunctionDataError"`\>

Error thrown when decoding function data fails
Not expected to be thrown unless ABI is incorrect

## Example

```ts
const {errors} = await tevm.call({address: '0x1234'})
errors.forEach(error => {
  if (error.name === 'DecodeFunctionDataError') {
    console.log(error.message)
  }
})
```

## Source

[packages/errors/src/utils/DecodeFunctionDataError.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/utils/DecodeFunctionDataError.ts#L14)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
