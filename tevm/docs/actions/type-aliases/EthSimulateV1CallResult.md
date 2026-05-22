[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / EthSimulateV1CallResult

# Type Alias: EthSimulateV1CallResult

> **EthSimulateV1CallResult** = `object`

Result of a single simulated call

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="error"></a> `error?` | [`SimulateCallError`](SimulateCallError.md) | Error information if the call failed |
| <a id="gasused"></a> `gasUsed` | `bigint` | Gas used by the call |
| <a id="logs"></a> `logs` | [`FilterLog`](FilterLog.md)[] | Logs emitted during the call execution |
| <a id="returndata"></a> `returnData` | [`Hex`](Hex.md) | The return data from the call |
| <a id="status"></a> `status` | `bigint` | Status of the call (1 = success, 0 = failure) |
