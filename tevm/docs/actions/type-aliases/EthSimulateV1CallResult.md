[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSimulateV1CallResult

# Type Alias: EthSimulateV1CallResult

> **EthSimulateV1CallResult** = `object`

Defined in: packages/actions/types/eth/EthResult.d.ts:290

Result of a single simulated call

## Properties

### error?

> `optional` **error**: [`SimulateCallError`](SimulateCallError.md)

Defined in: packages/actions/types/eth/EthResult.d.ts:310

Error information if the call failed

***

### gasUsed

> **gasUsed**: `bigint`

Defined in: packages/actions/types/eth/EthResult.d.ts:302

Gas used by the call

***

### logs

> **logs**: [`FilterLog`](FilterLog.md)[]

Defined in: packages/actions/types/eth/EthResult.d.ts:298

Logs emitted during the call execution

***

### returnData

> **returnData**: [`Hex`](Hex.md)

Defined in: packages/actions/types/eth/EthResult.d.ts:294

The return data from the call

***

### status

> **status**: `bigint`

Defined in: packages/actions/types/eth/EthResult.d.ts:306

Status of the call (1 = success, 0 = failure)
