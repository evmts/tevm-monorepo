[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / CallResult

# Type Alias: CallResult\<ErrorType\>

> **CallResult**\<`ErrorType`\> = `object`

Defined in: [packages/actions/src/Call/CallResult.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L31)

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

Defined in: [packages/actions/src/Call/CallResult.ts:52](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L52)

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

Defined in: [packages/actions/src/Call/CallResult.ts:186](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L186)

The amount of ether used by this transaction. Does not include L1 fees.

***

### baseFee?

> `optional` **baseFee**: `bigint`

Defined in: [packages/actions/src/Call/CallResult.ts:148](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L148)

The base fee of the transaction.

***

### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

Defined in: [packages/actions/src/Call/CallResult.ts:113](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L113)

Amount of blob gas consumed by the transaction.

***

### createdAddress?

> `optional` **createdAddress**: [`Address`](Address.md)

Defined in: [packages/actions/src/Call/CallResult.ts:117](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L117)

Address of created account during the transaction, if any.

***

### createdAddresses?

> `optional` **createdAddresses**: `Set`\<[`Address`](Address.md)\>

Defined in: [packages/actions/src/Call/CallResult.ts:126](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L126)

Map of addresses which were created (used in EIP 6780).
Note the addresses are not actually created until the transaction is mined.

***

### errors?

> `optional` **errors**: `ErrorType`[]

Defined in: [packages/actions/src/Call/CallResult.ts:140](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L140)

Description of the exception, if any occurred.

***

### executionGasUsed

> **executionGasUsed**: `bigint`

Defined in: [packages/actions/src/Call/CallResult.ts:95](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L95)

Amount of gas the code used to run within the EVM.
This only includes gas spent on the EVM execution itself and doesn't account for gas spent on other factors such as data storage.

***

### gas?

> `optional` **gas**: `bigint`

Defined in: [packages/actions/src/Call/CallResult.ts:90](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L90)

Amount of gas left after execution.

***

### gasRefund?

> `optional` **gasRefund**: `bigint`

Defined in: [packages/actions/src/Call/CallResult.ts:109](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L109)

The gas refund counter as a uint256.

***

### l1BaseFee?

> `optional` **l1BaseFee**: `bigint`

Defined in: [packages/actions/src/Call/CallResult.ts:175](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L175)

Latest known L1 base fee known by the L2 chain.
Only included when an OP-Stack common is provided.

#### See

[OP-Stack docs](https://docs.optimism.io/stack/transactions/fees)

***

### l1BlobFee?

> `optional` **l1BlobFee**: `bigint`

Defined in: [packages/actions/src/Call/CallResult.ts:168](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L168)

Current blob base fee known by the L2 chain.

#### See

[OP-Stack docs](https://docs.optimism.io/stack/transactions/fees)

***

### l1Fee?

> `optional` **l1Fee**: `bigint`

Defined in: [packages/actions/src/Call/CallResult.ts:155](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L155)

L1 fee that should be paid for the transaction.
Only included when an OP-Stack common is provided.

#### See

[OP-Stack docs](https://docs.optimism.io/stack/transactions/fees)

***

### l1GasUsed?

> `optional` **l1GasUsed**: `bigint`

Defined in: [packages/actions/src/Call/CallResult.ts:162](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L162)

Amount of L1 gas used to publish the transaction.
Only included when an OP-Stack common is provided.

#### See

[OP-Stack docs](https://docs.optimism.io/stack/transactions/fees)

***

### logs?

> `optional` **logs**: [`Log`](Log.md)[]

Defined in: [packages/actions/src/Call/CallResult.ts:105](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L105)

Array of logs that the contract emitted.

#### Example

```typescript
const logs = result.logs
logs?.forEach(log => console.log(log))
```

***

### minerValue?

> `optional` **minerValue**: `bigint`

Defined in: [packages/actions/src/Call/CallResult.ts:190](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L190)

The value that accrues to the miner by this transaction.

***

### preimages?

> `optional` **preimages**: `Record`\<[`Hex`](Hex.md), [`Hex`](Hex.md)\>

Defined in: [packages/actions/src/Call/CallResult.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L56)

Preimages mapping of the touched accounts from the transaction (see `reportPreimages` option).

***

### priorityFee?

> `optional` **priorityFee**: `bigint`

Defined in: [packages/actions/src/Call/CallResult.ts:144](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L144)

Priority fee set by the transaction.

***

### rawData

> **rawData**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/Call/CallResult.ts:136](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L136)

Encoded return value from the contract as a hex string.

#### Example

```typescript
const rawData = result.rawData
console.log(`Raw data returned: ${rawData}`)
```

***

### selfdestruct?

> `optional` **selfdestruct**: `Set`\<[`Address`](Address.md)\>

Defined in: [packages/actions/src/Call/CallResult.ts:121](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L121)

A set of accounts to selfdestruct.

***

### status?

> `optional` **status**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/Call/CallResult.ts:86](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L86)

The transaction receipt status when the call was included in the chain.
Will be '0x1' for success or '0x0' for failure.
Only present when the call creates a transaction (createTransaction option is enabled).

#### Example

```typescript
const status = result.status
if (status === '0x1') {
  console.log('Transaction succeeded')
} else if (status === '0x0') {
  console.log('Transaction failed')
}
```

***

### totalGasSpent?

> `optional` **totalGasSpent**: `bigint`

Defined in: [packages/actions/src/Call/CallResult.ts:182](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L182)

The amount of gas used in this transaction, which is paid for.
This contains the gas units that have been used on execution, plus the upfront cost,
which consists of calldata cost, intrinsic cost, and optionally the access list costs.
This is analogous to what `eth_estimateGas` would return. Does not include L1 fees.

***

### trace?

> `optional` **trace**: [`TraceResult`](TraceResult.md)

Defined in: [packages/actions/src/Call/CallResult.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L41)

The call trace if tracing is enabled on call.

#### Example

```typescript
const trace = result.trace
trace.structLogs.forEach(console.log)
```

***

### txHash?

> `optional` **txHash**: [`Hex`](Hex.md)

Defined in: [packages/actions/src/Call/CallResult.ts:70](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Call/CallResult.ts#L70)

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
