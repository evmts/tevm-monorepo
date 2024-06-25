[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / DumpStateResult

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

> **state**: [`TevmState`](TevmState.md)

The serialized tevm state

## Defined in

packages/actions/types/DumpState/DumpStateResult.d.ts:6
