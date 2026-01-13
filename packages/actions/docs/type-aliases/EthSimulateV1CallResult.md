[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSimulateV1CallResult

# Type Alias: EthSimulateV1CallResult

> **EthSimulateV1CallResult** = `object`

Defined in: [packages/actions/src/eth/EthResult.ts:385](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L385)

Result of a single simulated call

## Properties

### error?

> `optional` **error**: [`SimulateCallError`](SimulateCallError.md)

Defined in: [packages/actions/src/eth/EthResult.ts:405](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L405)

Error information if the call failed

***

### gasUsed

> **gasUsed**: `bigint`

Defined in: [packages/actions/src/eth/EthResult.ts:397](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L397)

Gas used by the call

***

### logs

> **logs**: [`FilterLog`](FilterLog.md)[]

Defined in: [packages/actions/src/eth/EthResult.ts:393](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L393)

Logs emitted during the call execution

***

### returnData

> **returnData**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/eth/EthResult.ts:389](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L389)

The return data from the call

***

### status

> **status**: `bigint`

Defined in: [packages/actions/src/eth/EthResult.ts:401](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthResult.ts#L401)

Status of the call (1 = success, 0 = failure)
