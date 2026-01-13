[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSimulateV2BlockStateCall

# Type Alias: EthSimulateV2BlockStateCall

> **EthSimulateV2BlockStateCall** = `object`

Defined in: [packages/actions/src/eth/EthParams.ts:493](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L493)

A block of calls to simulate with optional block and state overrides (V2)
Extends V1 with additional tracing options

## Properties

### blockOverrides?

> `readonly` `optional` **blockOverrides**: [`BlockOverrideSet`](BlockOverrideSet.md)

Defined in: [packages/actions/src/eth/EthParams.ts:497](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L497)

Block header fields to override for this simulated block

***

### calls

> `readonly` **calls**: readonly [`EthSimulateV2Call`](EthSimulateV2Call.md)[]

Defined in: [packages/actions/src/eth/EthParams.ts:505](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L505)

Calls to simulate in this block

***

### stateOverrides?

> `readonly` `optional` **stateOverrides**: [`StateOverrideSet`](StateOverrideSet.md)

Defined in: [packages/actions/src/eth/EthParams.ts:501](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L501)

State to override before executing this block's calls
