[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSimulateV2Call

# Type Alias: EthSimulateV2Call

> **EthSimulateV2Call** = [`EthSimulateV1Call`](EthSimulateV1Call.md) & `object`

Defined in: [packages/actions/src/eth/EthParams.ts:481](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L481)

Parameters for a single simulated call within a block (V2)
Extends V1 with additional tracing and gas estimation options

## Type Declaration

### estimateGas?

> `readonly` `optional` **estimateGas**: `boolean`

Whether to estimate gas for this call.
When true, the call will be executed to estimate gas.
