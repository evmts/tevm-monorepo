[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / CallResult

# Type Alias: CallResult\<ErrorType\>

> **CallResult**\<`ErrorType`\> = `object`

Defined in: packages/actions/types/Call/CallResult.d.ts:31

Result of a TEVM VM Call method.

## Example

```typescript
import { createClient } from 'viem'
import { createTevmTransport, tevmCall } from 'tevm'
import { optimism } from 'tevm/common'
import { CallResult } from 'tevm/actions'

const client = createClient({
  transport: createTevmTransport({}),
  chain: optimism,
})

const callParams = {
  data: '0x...',
  bytecode: '0x...',
  gasLimit: 420n,
}

const result: CallResult = await tevmCall(client, callParams)
console.log(result)
```

## See

[tevmCall](https://tevm.sh/reference/tevm/memory-client/functions/tevmCall/)

## Type Parameters

### ErrorType

`ErrorType` = [`TevmCallError`](TevmCallError.md)

## Properties

### accessList?

> `optional` **accessList**: `Record`\<[`Address`](Address.md), `Set`\<[`Hex`](Hex.md)\>\>

Defined in: packages/actions/types/Call/CallResult.d.ts:52

The access list if enabled on call.
Mapping of addresses to storage slots.

#### Example

```typescript
const accessList = result.accessList
console.log(accessList) // { "0x...": Set(["0x..."]) }
```

***

### amountSpent?

> `optional` **amountSpent**: `bigint`

Defined in: packages/actions/types/Call/CallResult.d.ts:170

The amount of ether used by this transaction. Does not include L1 fees.

***

### baseFee?

> `optional` **baseFee**: `bigint`

Defined in: packages/actions/types/Call/CallResult.d.ts:132

The base fee of the transaction.

***

### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

Defined in: packages/actions/types/Call/CallResult.d.ts:97

Amount of blob gas consumed by the transaction.

***

### createdAddress?

> `optional` **createdAddress**: [`Address`](Address.md)

Defined in: packages/actions/types/Call/CallResult.d.ts:101

Address of created account during the transaction, if any.

***

### createdAddresses?

> `optional` **createdAddresses**: `Set`\<[`Address`](Address.md)\>

Defined in: packages/actions/types/Call/CallResult.d.ts:110

Map of addresses which were created (used in EIP 6780).
Note the addresses are not actually created until the transaction is mined.

***

### errors?

> `optional` **errors**: `ErrorType`[]

Defined in: packages/actions/types/Call/CallResult.d.ts:124

Description of the exception, if any occurred.

***

### executionGasUsed

> **executionGasUsed**: `bigint`

Defined in: packages/actions/types/Call/CallResult.d.ts:79

Amount of gas the code used to run within the EVM.
This only includes gas spent on the EVM execution itself and doesn't account for gas spent on other factors such as data storage.

***

### gas?

> `optional` **gas**: `bigint`

Defined in: packages/actions/types/Call/CallResult.d.ts:74

Amount of gas left after execution.

***

### gasRefund?

> `optional` **gasRefund**: `bigint`

Defined in: packages/actions/types/Call/CallResult.d.ts:93

The gas refund counter as a uint256.

***

### l1BaseFee?

> `optional` **l1BaseFee**: `bigint`

Defined in: packages/actions/types/Call/CallResult.d.ts:159

Latest known L1 base fee known by the L2 chain.
Only included when an OP-Stack common is provided.

#### See

[OP-Stack docs](https://docs.optimism.io/stack/transactions/fees)

***

### l1BlobFee?

> `optional` **l1BlobFee**: `bigint`

Defined in: packages/actions/types/Call/CallResult.d.ts:152

Current blob base fee known by the L2 chain.

#### See

[OP-Stack docs](https://docs.optimism.io/stack/transactions/fees)

***

### l1Fee?

> `optional` **l1Fee**: `bigint`

Defined in: packages/actions/types/Call/CallResult.d.ts:139

L1 fee that should be paid for the transaction.
Only included when an OP-Stack common is provided.

#### See

[OP-Stack docs](https://docs.optimism.io/stack/transactions/fees)

***

### l1GasUsed?

> `optional` **l1GasUsed**: `bigint`

Defined in: packages/actions/types/Call/CallResult.d.ts:146

Amount of L1 gas used to publish the transaction.
Only included when an OP-Stack common is provided.

#### See

[OP-Stack docs](https://docs.optimism.io/stack/transactions/fees)

***

### logs?

> `optional` **logs**: [`Log`](Log.md)[]

Defined in: packages/actions/types/Call/CallResult.d.ts:89

Array of logs that the contract emitted.

#### Example

```typescript
const logs = result.logs
logs?.forEach(log => console.log(log))
```

***

### minerValue?

> `optional` **minerValue**: `bigint`

Defined in: packages/actions/types/Call/CallResult.d.ts:174

The value that accrues to the miner by this transaction.

***

### preimages?

> `optional` **preimages**: `Record`\<[`Hex`](Hex.md), [`Hex`](Hex.md)\>

Defined in: packages/actions/types/Call/CallResult.d.ts:56

Preimages mapping of the touched accounts from the transaction (see `reportPreimages` option).

***

### priorityFee?

> `optional` **priorityFee**: `bigint`

Defined in: packages/actions/types/Call/CallResult.d.ts:128

Priority fee set by the transaction.

***

### rawData

> **rawData**: [`Hex`](Hex.md)

Defined in: packages/actions/types/Call/CallResult.d.ts:120

Encoded return value from the contract as a hex string.

#### Example

```typescript
const rawData = result.rawData
console.log(`Raw data returned: ${rawData}`)
```

***

### selfdestruct?

> `optional` **selfdestruct**: `Set`\<[`Address`](Address.md)\>

Defined in: packages/actions/types/Call/CallResult.d.ts:105

A set of accounts to selfdestruct.

***

### totalGasSpent?

> `optional` **totalGasSpent**: `bigint`

Defined in: packages/actions/types/Call/CallResult.d.ts:166

The amount of gas used in this transaction, which is paid for.
This contains the gas units that have been used on execution, plus the upfront cost,
which consists of calldata cost, intrinsic cost, and optionally the access list costs.
This is analogous to what `eth_estimateGas` would return. Does not include L1 fees.

***

### trace?

> `optional` **trace**: [`DebugTraceCallResult`](DebugTraceCallResult.md)

Defined in: packages/actions/types/Call/CallResult.d.ts:41

The call trace if tracing is enabled on call.

#### Example

```typescript
const trace = result.trace
trace.structLogs.forEach(console.log)
```

***

### txHash?

> `optional` **txHash**: [`Hex`](Hex.md)

Defined in: packages/actions/types/Call/CallResult.d.ts:70

The returned transaction hash if the call was included in the chain.
Will not be defined if the call was not included in the chain.
Whether a call is included in the chain depends on the `createTransaction` option and the result of the call.

#### Example

```typescript
const txHash = result.txHash
if (txHash) {
  console.log(`Transaction included in the chain with hash: ${txHash}`)
}
```
