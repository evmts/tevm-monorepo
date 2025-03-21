[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / SimulateCallResult

# Type Alias: SimulateCallResult\<ErrorType\>

> **SimulateCallResult**\<`ErrorType`\>: [`CallResult`](../../index/type-aliases/CallResult.md)\<`ErrorType`\> & `object`

Defined in: packages/actions/types/SimulateCall/SimulateCallResult.d.ts:18

Result of calling [simulateCallHandler](../functions/simulateCallHandler.md)

## Type declaration

### blockNumber

> **blockNumber**: `bigint`

Block number used for simulation

## Type Parameters

• **ErrorType** *extends* `Error` = [`TevmSimulateCallError`](../classes/TevmSimulateCallError.md)
