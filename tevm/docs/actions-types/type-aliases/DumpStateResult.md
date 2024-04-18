**tevm** • [Readme](../../README.md) \| [API](../../modules.md)

***

[tevm](../../README.md) / [actions-types](../README.md) / DumpStateResult

# Type alias: DumpStateResult\<ErrorType\>

> **DumpStateResult**\<`ErrorType`\>: `object`

Result of the dumpState method

## Type parameters

• **ErrorType** = [`DumpStateError`](../../errors/type-aliases/DumpStateError.md)

## Type declaration

### errors?

> **`optional`** **errors**: `ErrorType`[]

Description of the exception, if any occurred

### state

> **state**: [`TevmState`](../../index/type-aliases/TevmState.md)

The serialized tevm state

## Source

packages/actions-types/types/result/DumpStateResult.d.ts:6
