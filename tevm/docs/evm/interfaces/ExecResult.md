[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [evm](../README.md) / ExecResult

# Interface: ExecResult

Result of executing a call via the EVM.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="blobgasused"></a> `blobGasUsed?` | `bigint` | Amount of blob gas consumed by the transaction |
| <a id="createdaddresses"></a> `createdAddresses?` | `Set`\<`` `0x${string}` ``\> | Map of addresses which were created (used in EIP 6780) |
| <a id="exceptionerror"></a> `exceptionError?` | [`EVMError`](../classes/EVMError.md) | Description of the exception, if any occurred |
| <a id="executiongasused"></a> `executionGasUsed` | `bigint` | Amount of gas the code used to run |
| <a id="gas"></a> `gas?` | `bigint` | Amount of gas left |
| <a id="gasrefund"></a> `gasRefund?` | `bigint` | The gas refund counter |
| <a id="logs"></a> `logs?` | [`Log`](../type-aliases/Log.md)[] | Array of logs that the contract emitted |
| <a id="returnvalue"></a> `returnValue` | `Uint8Array` | Return value from the contract |
| <a id="runstate"></a> `runState?` | `RunState` | - |
| <a id="selfdestruct"></a> `selfdestruct?` | `Set`\<`` `0x${string}` ``\> | A set of accounts to selfdestruct |
