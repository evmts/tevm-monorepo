**@tevm/errors** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > CallError

# Type alias: CallError

> **CallError**: [`BaseCallError`](BaseCallError.md) \| [`InvalidSaltError`](InvalidSaltError.md) \| [`InvalidDataError`](InvalidDataError.md) \| [`InvalidDeployedBytecodeError`](InvalidDeployedBytecodeError.md)

Error returned by call tevm procedure

## Example

```ts
const {errors} = await tevm.call({address: '0x1234'})
if (errors?.length) {
 console.log(errors[0].name) // InvalidDataError
}
```

## Source

[packages/errors/src/actions/CallError.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/actions/CallError.ts#L12)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
