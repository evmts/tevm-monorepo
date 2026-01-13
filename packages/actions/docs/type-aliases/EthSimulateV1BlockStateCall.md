[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSimulateV1BlockStateCall

# Type Alias: EthSimulateV1BlockStateCall

> **EthSimulateV1BlockStateCall** = `object`

Defined in: [packages/actions/src/eth/EthParams.ts:433](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L433)

A block of calls to simulate with optional block and state overrides

## Properties

### blockOverrides?

> `readonly` `optional` **blockOverrides**: [`BlockOverrideSet`](BlockOverrideSet.md)

Defined in: [packages/actions/src/eth/EthParams.ts:437](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L437)

Block header fields to override for this simulated block

***

### calls

> `readonly` **calls**: readonly [`EthSimulateV1Call`](EthSimulateV1Call.md)[]

Defined in: [packages/actions/src/eth/EthParams.ts:445](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L445)

Calls to simulate in this block

***

### stateOverrides?

> `readonly` `optional` **stateOverrides**: [`StateOverrideSet`](StateOverrideSet.md)

Defined in: [packages/actions/src/eth/EthParams.ts:441](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L441)

State to override before executing this block's calls
