[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / EthSimulateV1BlockStateCall

# Type Alias: EthSimulateV1BlockStateCall

> **EthSimulateV1BlockStateCall** = `object`

Defined in: [packages/actions/src/eth/EthParams.ts:440](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L440)

A block of calls to simulate with optional block and state overrides

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="blockoverrides"></a> `blockOverrides?` | `readonly` | [`BlockOverrideSet`](BlockOverrideSet.md) | Block header fields to override for this simulated block | [packages/actions/src/eth/EthParams.ts:444](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L444) |
| <a id="calls"></a> `calls` | `readonly` | readonly [`EthSimulateV1Call`](EthSimulateV1Call.md)[] | Calls to simulate in this block | [packages/actions/src/eth/EthParams.ts:452](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L452) |
| <a id="stateoverrides"></a> `stateOverrides?` | `readonly` | [`StateOverrideSet`](StateOverrideSet.md) | State to override before executing this block's calls | [packages/actions/src/eth/EthParams.ts:448](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/EthParams.ts#L448) |
