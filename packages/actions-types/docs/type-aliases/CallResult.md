[**@tevm/actions-types**](../README.md) • **Docs**

***

[@tevm/actions-types](../globals.md) / CallResult

# Type alias: CallResult\<ErrorType\>

> **CallResult**\<`ErrorType`\>: `object`

Result of a Tevm VM Call method

## Type parameters

• **ErrorType** = `CallError`

## Type declaration

### accessList?

> `optional` **accessList**: `Record`\<[`Address`](Address.md), `Set`\<`string`\>\>

The access list if enabled on call

### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

Amount of blob gas consumed by the transaction

### createdAddress?

> `optional` **createdAddress**: [`Address`](Address.md)

Address of created account during transaction, if any

### createdAddresses?

> `optional` **createdAddresses**: `Set`\<[`Address`](Address.md)\>

Map of addresses which were created (used in EIP 6780)

### errors?

> `optional` **errors**: `ErrorType`[]

Description of the exception, if any occurred

### executionGasUsed

> **executionGasUsed**: `bigint`

Amount of gas the code used to run

### gas?

> `optional` **gas**: `bigint`

Amount of gas left

### gasRefund?

> `optional` **gasRefund**: `bigint`

The gas refund counter as a uint256

### logs?

> `optional` **logs**: [`Log`](Log.md)[]

Array of logs that the contract emitted

### rawData

> **rawData**: [`Hex`](Hex.md)

Encoded return value from the contract as hex string

### selfdestruct?

> `optional` **selfdestruct**: `Set`\<[`Address`](Address.md)\>

A set of accounts to selfdestruct

### trace?

> `optional` **trace**: [`DebugTraceCallResult`](DebugTraceCallResult.md)

The call trace if tracing is enabled on call

### txHash?

> `optional` **txHash**: [`Hex`](Hex.md)

The returned tx hash if the call was included in the chain
Will not be defined if the call was not included in the chain
Whether a call is included in the chain depends on if the
`createTransaction` option and the result of the call

## Source

[result/CallResult.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/CallResult.ts#L8)
