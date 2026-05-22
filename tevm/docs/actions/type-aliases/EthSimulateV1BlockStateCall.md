[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSimulateV1BlockStateCall

# Type Alias: EthSimulateV1BlockStateCall

> **EthSimulateV1BlockStateCall** = `object`

A block of calls to simulate with optional block and state overrides

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="blockoverrides"></a> `blockOverrides?` | `readonly` | [`BlockOverrideSet`](BlockOverrideSet.md) | Block header fields to override for this simulated block |
| <a id="calls"></a> `calls` | `readonly` | readonly [`EthSimulateV1Call`](EthSimulateV1Call.md)[] | Calls to simulate in this block |
| <a id="stateoverrides"></a> `stateOverrides?` | `readonly` | [`StateOverrideSet`](StateOverrideSet.md) | State to override before executing this block's calls |
