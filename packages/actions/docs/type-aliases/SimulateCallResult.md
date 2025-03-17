[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / SimulateCallResult

# Type Alias: SimulateCallResult\<ErrorType\>

> **SimulateCallResult**\<`ErrorType`\>: [`CallResult`](CallResult.md)\<`ErrorType`\> & `object`

Defined in: [packages/actions/src/SimulateCall/SimulateCallResult.ts:29](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/SimulateCall/SimulateCallResult.ts#L29)

Result of calling [simulateCallHandler](../functions/simulateCallHandler.md)

## Type declaration

### blockNumber

> **blockNumber**: `bigint`

Block number used for simulation

## Type Parameters

• **ErrorType** *extends* `Error` = [`TevmSimulateCallError`](../classes/TevmSimulateCallError.md)
