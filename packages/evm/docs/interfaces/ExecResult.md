[**@tevm/evm**](../README.md)

***

[@tevm/evm](../globals.md) / ExecResult

# Interface: ExecResult

Result of executing a call via the EVM.

## Properties

### blobGasUsed?

> `optional` **blobGasUsed?**: `bigint`

Amount of blob gas consumed by the transaction

***

### createdAddresses?

> `optional` **createdAddresses?**: `Set`\<`` `0x${string}` ``\>

Map of addresses which were created (used in EIP 6780)

***

### exceptionError?

> `optional` **exceptionError?**: [`EvmError`](../classes/EvmError.md)

Description of the exception, if any occurred

***

### executionGasUsed

> **executionGasUsed**: `bigint`

Amount of gas the code used to run

***

### gas?

> `optional` **gas?**: `bigint`

Amount of gas left

***

### gasRefund?

> `optional` **gasRefund?**: `bigint`

The gas refund counter

***

### logs?

> `optional` **logs?**: [`Log`](../type-aliases/Log.md)[]

Array of logs that the contract emitted

***

### returnValue

> **returnValue**: `Uint8Array`

Return value from the contract

***

### runState?

> `optional` **runState?**: `RunState`

***

### selfdestruct?

> `optional` **selfdestruct?**: `Set`\<`` `0x${string}` ``\>

A set of accounts to selfdestruct
