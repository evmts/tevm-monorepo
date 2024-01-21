**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [actions-types](../README.md) > CallError

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

packages/actions-types/types/errors/CallError.d.ts:13

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)