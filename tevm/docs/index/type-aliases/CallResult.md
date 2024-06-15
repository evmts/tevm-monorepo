[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / CallResult

# Type alias: CallResult\<ErrorType\>

> **CallResult**\<`ErrorType`\>: `object`

Result of a Tevm VM Call method

## Type parameters

• **ErrorType** = [`TevmCallError`](TevmCallError.md)

## Type declaration

### accessList?

> `optional` **accessList**: `Record`\<`Address`, `Set`\<`Hex`\>\>

The access list if enabled on call
Mapping of addresses to storage slots

### amountSpent?

> `optional` **amountSpent**: `bigint`

The amount of ether used by this transaction. Does not include l1 fees

### baseFee?

> `optional` **baseFee**: `bigint`

The base fee of the transaction

### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

Amount of blob gas consumed by the transaction

### createdAddress?

> `optional` **createdAddress**: `Address`

Address of created account during transaction, if any

### createdAddresses?

> `optional` **createdAddresses**: `Set`\<`Address`\>

Map of addresses which were created (used in EIP 6780)
Note the addresses are not actually created til the tx is mined

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

### l1BaseFee?

> `optional` **l1BaseFee**: `bigint`

Latest known L1 base fee known by the l2 chain.
Only included when an op-stack common is provided

#### See

[OP-Stack docs](https://docs.optimism.io/stack/transactions/fees)

### l1BlobFee?

> `optional` **l1BlobFee**: `bigint`

Current blob base fee known by the l2 chain.

#### See

[OP-Stack docs](https://docs.optimism.io/stack/transactions/fees)

### l1Fee?

> `optional` **l1Fee**: `bigint`

L1 fee that should be paid for the tx
Only included when an op-stack common is provided

#### See

[OP-Stack docs](https://docs.optimism.io/stack/transactions/fees)

### l1GasUsed?

> `optional` **l1GasUsed**: `bigint`

Amount of L1 gas used to publish the transaction.
Only included when an op-stack common is provided

#### See

[OP-Stack docs](https://docs.optimism.io/stack/transactions/fees)

### logs?

> `optional` **logs**: `Log`[]

Array of logs that the contract emitted

### minerValue?

> `optional` **minerValue**: `bigint`

The value that accrues to the miner by this transaction

### preimages?

> `optional` **preimages**: `Record`\<`Hex`, `Hex`\>

Preimages mapping of the touched accounts from the tx (see `reportPreimages` option)

### priorityFee?

> `optional` **priorityFee**: `bigint`

Priority fee set by the transaction.

### rawData

> **rawData**: `Hex`

Encoded return value from the contract as hex string

### selfdestruct?

> `optional` **selfdestruct**: `Set`\<`Address`\>

A set of accounts to selfdestruct

### totalGasSpent?

> `optional` **totalGasSpent**: `bigint`

The amount of gas used in this transaction, which is paid for
This contains the gas units that have been used on execution, plus the upfront cost,
which consists of calldata cost, intrinsic cost and optionally the access list costs
Does not include l1 fees

### trace?

> `optional` **trace**: `DebugTraceCallResult`

The call trace if tracing is enabled on call

### txHash?

> `optional` **txHash**: `Hex`

The returned tx hash if the call was included in the chain
Will not be defined if the call was not included in the chain
Whether a call is included in the chain depends on if the
`createTransaction` option and the result of the call

## Source

packages/actions/types/Call/CallResult.d.ts:7
