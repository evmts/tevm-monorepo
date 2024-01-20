**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > CallError

# Type alias: CallError

> **CallError**: [`BaseCallError`](../../api/type-aliases/BaseCallError.md) \| [`InvalidSaltError`](../../api/type-aliases/InvalidSaltError.md) \| [`InvalidDataError`](../../api/type-aliases/InvalidDataError.md) \| [`InvalidDeployedBytecodeError`](../../api/type-aliases/InvalidDeployedBytecodeError.md)

Error returned by call tevm procedure

## Example

```ts
const {errors} = await tevm.call({address: '0x1234'})
if (errors?.length) {
 console.log(errors[0].name) // InvalidDataError
}
```

## Source

vm/api/types/errors/CallError.d.ts:13

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
