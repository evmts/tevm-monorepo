[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSimulateV2BlockStateCall

# Type Alias: EthSimulateV2BlockStateCall

> **EthSimulateV2BlockStateCall** = `object`

A block of calls to simulate with optional block and state overrides (V2)
Extends V1 with additional tracing options

## Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="blockoverrides"></a> `blockOverrides?` | `readonly` | [`BlockOverrideSet`](BlockOverrideSet.md) | Block header fields to override for this simulated block |
| <a id="calls"></a> `calls` | `readonly` | readonly [`EthSimulateV2Call`](EthSimulateV2Call.md)[] | Calls to simulate in this block |
| <a id="stateoverrides"></a> `stateOverrides?` | `readonly` | [`StateOverrideSet`](StateOverrideSet.md) | State to override before executing this block's calls |
