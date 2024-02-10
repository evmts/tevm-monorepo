**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [actions-types](../README.md) > DumpStateResult

# Type alias: DumpStateResult`<ErrorType>`

> **DumpStateResult**\<`ErrorType`\>: `object`

Result of the dumpState method

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `ErrorType` | [`DumpStateError`](../../errors/type-aliases/DumpStateError.md) |

## Type declaration

### errors

> **errors**?: `ErrorType`[]

Description of the exception, if any occurred

### state

> **state**: [`SerializableTevmState`](../../index/type-aliases/SerializableTevmState.md)

The serialized tevm state

## Source

packages/actions-types/types/result/DumpStateResult.d.ts:6

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
