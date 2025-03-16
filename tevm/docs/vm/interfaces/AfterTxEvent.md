[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / AfterTxEvent

# Interface: AfterTxEvent

Defined in: packages/vm/types/utils/AfterTxEvent.d.ts:19

Event data emitted after a transaction has been executed.
Extends RunTxResult with the transaction that triggered the event.

## Example

```typescript
import { AfterTxEvent } from '@tevm/vm'
import { VM } from '@tevm/vm'

// Access in VM event handlers
const vm = new VM()
vm.events.on('afterTx', (event: AfterTxEvent) => {
  console.log('Transaction executed:', event.transaction)
  console.log('Gas used:', event.gasUsed)
})
```

## Extends

- [`RunTxResult`](RunTxResult.md)

## Properties

### accessList?

> `optional` **accessList**: [`AccessList`](../../tx/type-aliases/AccessList.md)

Defined in: packages/vm/types/utils/RunTxResult.d.ts:35

EIP-2930 access list generated for the tx (see `reportAccessList` option)

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`accessList`](RunTxResult.md#accesslist)

***

### amountSpent

> **amountSpent**: `bigint`

Defined in: packages/vm/types/utils/RunTxResult.d.ts:17

The amount of ether used by this transaction

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`amountSpent`](RunTxResult.md#amountspent)

***

### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

Defined in: packages/vm/types/utils/RunTxResult.d.ts:47

This is the blob gas units times the fee per blob gas for 4844 transactions

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`blobGasUsed`](RunTxResult.md#blobgasused)

***

### bloom

> **bloom**: `Bloom`

Defined in: packages/vm/types/utils/RunTxResult.d.ts:13

Bloom filter resulted from transaction

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`bloom`](RunTxResult.md#bloom)

***

### createdAddress?

> `optional` **createdAddress**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:273

Address of created account during transaction, if any

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`createdAddress`](RunTxResult.md#createdaddress)

***

### execResult

> **execResult**: [`ExecResult`](../../evm/interfaces/ExecResult.md)

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:277

Contains the results from running the code, if any, as described in runCode

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`execResult`](RunTxResult.md#execresult)

***

### gasRefund

> **gasRefund**: `bigint`

Defined in: packages/vm/types/utils/RunTxResult.d.ts:31

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`gasRefund`](RunTxResult.md#gasrefund)

***

### minerValue

> **minerValue**: `bigint`

Defined in: packages/vm/types/utils/RunTxResult.d.ts:43

The value that accrues to the miner by this transaction

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`minerValue`](RunTxResult.md#minervalue)

***

### preimages?

> `optional` **preimages**: `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: packages/vm/types/utils/RunTxResult.d.ts:39

Preimages mapping of the touched accounts from the tx (see `reportPreimages` option)

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`preimages`](RunTxResult.md#preimages)

***

### receipt

> **receipt**: [`TxReceipt`](../type-aliases/TxReceipt.md)

Defined in: packages/vm/types/utils/RunTxResult.d.ts:21

The tx receipt

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`receipt`](RunTxResult.md#receipt)

***

### totalGasSpent

> **totalGasSpent**: `bigint`

Defined in: packages/vm/types/utils/RunTxResult.d.ts:27

The amount of gas used in this transaction, which is paid for
This contains the gas units that have been used on execution, plus the upfront cost,
which consists of calldata cost, intrinsic cost and optionally the access list costs

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`totalGasSpent`](RunTxResult.md#totalgasspent)

***

### transaction

> **transaction**: [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)

Defined in: packages/vm/types/utils/AfterTxEvent.d.ts:23

The transaction which just got finished
