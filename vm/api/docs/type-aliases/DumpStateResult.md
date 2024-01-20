**@tevm/api** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > DumpStateResult

# Type alias: DumpStateResult`<ErrorType>`

> **DumpStateResult**\<`ErrorType`\>: `object`

Result of Account Action

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `ErrorType` | [`DumpStateError`](DumpStateError.md) |

## Type declaration

### errors

> **errors**?: `ErrorType`[]

Description of the exception, if any occurred

### state

> **state**: `SerializableTevmState`

The serialized tevm state

## Source

[result/DumpStateResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/DumpStateResult.ts#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
