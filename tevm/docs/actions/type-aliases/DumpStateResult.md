[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / DumpStateResult

# Type Alias: DumpStateResult\<ErrorType\>

> **DumpStateResult**\<`ErrorType`\> = `object`

Result of the dumpState method.

This type represents the possible results of executing the `dumpState` method in TEVM.
It includes the serialized TEVM state and any errors that may have occurred.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `ErrorType` | [`TevmDumpStateError`](TevmDumpStateError.md) |

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="errors"></a> `errors?` | `ErrorType`[] | Description of the exception, if any occurred. This property contains an array of errors that may have occurred during the execution of the `dumpState` method. Each error provides detailed information about what went wrong. |
| <a id="state"></a> `state` | [`SerializableTevmState`](../../state/type-aliases/SerializableTevmState.md) | The serialized TEVM state. This property contains the entire state of the TEVM, serialized into a JSON-compatible format. This state can be used for debugging, analysis, or state persistence. |
