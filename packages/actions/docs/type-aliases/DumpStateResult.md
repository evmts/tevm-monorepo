[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / DumpStateResult

# Type Alias: DumpStateResult\<ErrorType\>

> **DumpStateResult**\<`ErrorType`\> = `object`

Defined in: [packages/actions/src/DumpState/DumpStateResult.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/DumpState/DumpStateResult.ts#L10)

Result of the dumpState method.

This type represents the possible results of executing the `dumpState` method in TEVM.
It includes the serialized TEVM state and any errors that may have occurred.

## Type Parameters

### ErrorType

`ErrorType` = [`TevmDumpStateError`](TevmDumpStateError.md)

## Properties

### errors?

> `optional` **errors**: `ErrorType`[]

Defined in: [packages/actions/src/DumpState/DumpStateResult.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/DumpState/DumpStateResult.ts#L24)

Description of the exception, if any occurred.

This property contains an array of errors that may have occurred during the execution
of the `dumpState` method. Each error provides detailed information about what went wrong.

***

### state

> **state**: `TevmState`

Defined in: [packages/actions/src/DumpState/DumpStateResult.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/DumpState/DumpStateResult.ts#L17)

The serialized TEVM state.

This property contains the entire state of the TEVM, serialized into a JSON-compatible
format. This state can be used for debugging, analysis, or state persistence.
