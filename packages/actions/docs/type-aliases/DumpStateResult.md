[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / DumpStateResult

# Type Alias: DumpStateResult\<ErrorType\>

> **DumpStateResult**\<`ErrorType`\>: `object`

Result of the dumpState method.

This type represents the possible results of executing the `dumpState` method in TEVM.
It includes the serialized TEVM state and any errors that may have occurred.

## Type Parameters

• **ErrorType** = [`TevmDumpStateError`](TevmDumpStateError.md)

## Type declaration

### errors?

> `optional` **errors**: `ErrorType`[]

Description of the exception, if any occurred.

This property contains an array of errors that may have occurred during the execution
of the `dumpState` method. Each error provides detailed information about what went wrong.

### state

> **state**: `TevmState`

The serialized TEVM state.

This property contains the entire state of the TEVM, serialized into a JSON-compatible
format. This state can be used for debugging, analysis, or state persistence.

## Defined in

[packages/actions/src/DumpState/DumpStateResult.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/DumpState/DumpStateResult.ts#L10)
