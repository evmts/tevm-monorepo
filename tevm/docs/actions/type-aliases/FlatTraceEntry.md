[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / FlatTraceEntry

# Type Alias: FlatTraceEntry

> **FlatTraceEntry** = `object`

A single trace entry in the flat trace array

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="action"></a> `action` | [`FlatCallAction`](FlatCallAction.md) \| [`FlatCreateAction`](FlatCreateAction.md) | Action details |
| <a id="blockhash"></a> `blockHash?` | [`Hex`](Hex.md) | Block hash where the transaction occurred |
| <a id="blocknumber"></a> `blockNumber?` | `bigint` | Block number where the transaction occurred |
| <a id="error"></a> `error?` | `string` | Error message if the call failed |
| <a id="result"></a> `result` | [`FlatCallResult`](FlatCallResult.md) \| [`FlatCreateResult`](FlatCreateResult.md) \| `null` | Result of the action (null if call failed) |
| <a id="revertreason"></a> `revertReason?` | `string` | Revert reason if the call reverted |
| <a id="subtraces"></a> `subtraces` | `number` | Number of child traces |
| <a id="traceaddress"></a> `traceAddress` | `number`[] | Position in the trace tree as an array of indices |
| <a id="transactionhash"></a> `transactionHash?` | [`Hex`](Hex.md) | Transaction hash |
| <a id="transactionposition"></a> `transactionPosition?` | `number` | Transaction index in the block |
| <a id="type"></a> `type` | `"call"` \| `"create"` \| `"suicide"` | Type of trace: "call" or "create" |
