[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / FlatTraceEntry

# Type Alias: FlatTraceEntry

> **FlatTraceEntry** = `object`

Defined in: [packages/actions/src/common/FlatCallTraceResult.ts:61](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L61)

A single trace entry in the flat trace array

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="action"></a> `action` | [`FlatCallAction`](FlatCallAction.md) \| [`FlatCreateAction`](FlatCreateAction.md) | Action details | [packages/actions/src/common/FlatCallTraceResult.ts:63](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L63) |
| <a id="blockhash"></a> `blockHash?` | [`Hex`](Hex.md) | Block hash where the transaction occurred | [packages/actions/src/common/FlatCallTraceResult.ts:65](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L65) |
| <a id="blocknumber"></a> `blockNumber?` | `bigint` | Block number where the transaction occurred | [packages/actions/src/common/FlatCallTraceResult.ts:67](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L67) |
| <a id="error"></a> `error?` | `string` | Error message if the call failed | [packages/actions/src/common/FlatCallTraceResult.ts:69](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L69) |
| <a id="result"></a> `result` | [`FlatCallResult`](FlatCallResult.md) \| [`FlatCreateResult`](FlatCreateResult.md) \| `null` | Result of the action (null if call failed) | [packages/actions/src/common/FlatCallTraceResult.ts:73](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L73) |
| <a id="revertreason"></a> `revertReason?` | `string` | Revert reason if the call reverted | [packages/actions/src/common/FlatCallTraceResult.ts:71](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L71) |
| <a id="subtraces"></a> `subtraces` | `number` | Number of child traces | [packages/actions/src/common/FlatCallTraceResult.ts:75](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L75) |
| <a id="traceaddress"></a> `traceAddress` | `number`[] | Position in the trace tree as an array of indices | [packages/actions/src/common/FlatCallTraceResult.ts:77](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L77) |
| <a id="transactionhash"></a> `transactionHash?` | [`Hex`](Hex.md) | Transaction hash | [packages/actions/src/common/FlatCallTraceResult.ts:79](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L79) |
| <a id="transactionposition"></a> `transactionPosition?` | `number` | Transaction index in the block | [packages/actions/src/common/FlatCallTraceResult.ts:81](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L81) |
| <a id="type"></a> `type` | `"call"` \| `"create"` \| `"suicide"` | Type of trace: "call" or "create" | [packages/actions/src/common/FlatCallTraceResult.ts:83](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/common/FlatCallTraceResult.ts#L83) |
