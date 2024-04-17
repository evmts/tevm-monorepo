**@tevm/actions-types** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/actions-types](../README.md) / DumpStateResult

# Type alias: DumpStateResult\<ErrorType\>

> **DumpStateResult**\<`ErrorType`\>: `object`

Result of the dumpState method

## Type parameters

• **ErrorType** = `DumpStateError`

## Type declaration

### errors?

> **`optional`** **errors**: `ErrorType`[]

Description of the exception, if any occurred

### state

> **state**: `TevmState`

The serialized tevm state

## Source

[result/DumpStateResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/DumpStateResult.ts#L7)
