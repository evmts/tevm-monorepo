[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSimulateV2BlockStateCall

# Type Alias: EthSimulateV2BlockStateCall

> **EthSimulateV2BlockStateCall** = `object`

Defined in: [packages/actions/src/eth/EthParams.ts:500](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L500)

A block of calls to simulate with optional block and state overrides (V2)
Extends V1 with additional tracing options

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="blockoverrides"></a> `blockOverrides?` | `readonly` | [`BlockOverrideSet`](BlockOverrideSet.md) | Block header fields to override for this simulated block | [packages/actions/src/eth/EthParams.ts:504](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L504) |
| <a id="calls"></a> `calls` | `readonly` | readonly [`EthSimulateV2Call`](EthSimulateV2Call.md)[] | Calls to simulate in this block | [packages/actions/src/eth/EthParams.ts:512](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L512) |
| <a id="stateoverrides"></a> `stateOverrides?` | `readonly` | [`StateOverrideSet`](StateOverrideSet.md) | State to override before executing this block's calls | [packages/actions/src/eth/EthParams.ts:508](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L508) |
