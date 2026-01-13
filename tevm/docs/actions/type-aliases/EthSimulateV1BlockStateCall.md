[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSimulateV1BlockStateCall

# Type Alias: EthSimulateV1BlockStateCall

> **EthSimulateV1BlockStateCall** = `object`

Defined in: packages/actions/types/eth/EthParams.d.ts:406

A block of calls to simulate with optional block and state overrides

## Properties

### blockOverrides?

> `readonly` `optional` **blockOverrides**: [`BlockOverrideSet`](BlockOverrideSet.md)

Defined in: packages/actions/types/eth/EthParams.d.ts:410

Block header fields to override for this simulated block

***

### calls

> `readonly` **calls**: readonly [`EthSimulateV1Call`](EthSimulateV1Call.md)[]

Defined in: packages/actions/types/eth/EthParams.d.ts:418

Calls to simulate in this block

***

### stateOverrides?

> `readonly` `optional` **stateOverrides**: [`StateOverrideSet`](StateOverrideSet.md)

Defined in: packages/actions/types/eth/EthParams.d.ts:414

State to override before executing this block's calls
