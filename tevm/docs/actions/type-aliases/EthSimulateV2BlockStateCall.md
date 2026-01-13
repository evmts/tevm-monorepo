[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSimulateV2BlockStateCall

# Type Alias: EthSimulateV2BlockStateCall

> **EthSimulateV2BlockStateCall** = `object`

Defined in: packages/actions/types/eth/EthParams.d.ts:462

A block of calls to simulate with optional block and state overrides (V2)
Extends V1 with additional tracing options

## Properties

### blockOverrides?

> `readonly` `optional` **blockOverrides**: [`BlockOverrideSet`](BlockOverrideSet.md)

Defined in: packages/actions/types/eth/EthParams.d.ts:466

Block header fields to override for this simulated block

***

### calls

> `readonly` **calls**: readonly [`EthSimulateV2Call`](EthSimulateV2Call.md)[]

Defined in: packages/actions/types/eth/EthParams.d.ts:474

Calls to simulate in this block

***

### stateOverrides?

> `readonly` `optional` **stateOverrides**: [`StateOverrideSet`](StateOverrideSet.md)

Defined in: packages/actions/types/eth/EthParams.d.ts:470

State to override before executing this block's calls
