[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / DumpStateResult

# Type Alias: DumpStateResult\<ErrorType\>

> **DumpStateResult**\<`ErrorType`\>: `object`

Result of the dumpState method

## Type Parameters

• **ErrorType** = [`TevmDumpStateError`](TevmDumpStateError.md)

## Type declaration

### errors?

> `optional` **errors**: `ErrorType`[]

Description of the exception, if any occurred

### state

> **state**: `TevmState`

The serialized tevm state

## Defined in

[packages/actions/src/DumpState/DumpStateResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/DumpState/DumpStateResult.ts#L7)
