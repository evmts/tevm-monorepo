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

> `optional` **accessList**: `Record`\<[`Address`](Address.md), `Set`\<[`Hex`](Hex.md)\>\>

The access list if enabled on call
Mapping of addresses to storage slots

### amountSpent?

> `optional` **amountSpent**: `bigint`

The amount of ether used by this transaction
Only included if `createTransaction` is set to `true`

### baseFee?

> `optional` **baseFee**: `bigint`

The base fee of the transaction
Only included if `createTransaction` is set to `true`

### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

Amount of blob gas consumed by the transaction

### createdAddress?

> `optional` **createdAddress**: [`Address`](Address.md)

Address of created account during transaction, if any

### createdAddresses?

> `optional` **createdAddresses**: `Set`\<[`Address`](Address.md)\>

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

### l1DataFee?

> `optional` **l1DataFee**: `bigint`

The data fee charged for calldata on an Rollup transaction
Only included if `createTransaction` is set to `true`

#### See

[OP-Stack docs](https://docs.optimism.io/stack/transactions/fees)

### logs?

> `optional` **logs**: [`Log`](Log.md)[]

Array of logs that the contract emitted

### minerValue?

> `optional` **minerValue**: `bigint`

The value that accrues to the miner by this transaction
Only included if `createTransaction` is set to `true`

### preimages?

> `optional` **preimages**: `Record`\<[`Hex`](Hex.md), [`Hex`](Hex.md)\>

Preimages mapping of the touched accounts from the tx (see `reportPreimages` option)

### priorityFee?

> `optional` **priorityFee**: `bigint`

Priority fee set by the transaction.
Only included if `createTransaction` is set to `true`

### rawData

> **rawData**: [`Hex`](Hex.md)

Encoded return value from the contract as hex string

### selfdestruct?

> `optional` **selfdestruct**: `Set`\<[`Address`](Address.md)\>

A set of accounts to selfdestruct

### totalGasSpent?

> `optional` **totalGasSpent**: `bigint`

The amount of gas used in this transaction, which is paid for
This contains the gas units that have been used on execution, plus the upfront cost,
which consists of calldata cost, intrinsic cost and optionally the access list costs
Only included if `createTransaction` is set to `true`

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
