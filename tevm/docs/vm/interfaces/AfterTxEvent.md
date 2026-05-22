[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / AfterTxEvent

# Interface: AfterTxEvent

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

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="accesslist"></a> `accessList?` | [`AccessList`](../../tx/type-aliases/AccessList.md) | EIP-2930 access list generated for the tx (see `reportAccessList` option) | [`RunTxResult`](RunTxResult.md).[`accessList`](RunTxResult.md#accesslist) |
| <a id="amountspent"></a> `amountSpent` | `bigint` | The amount of ether used by this transaction | [`RunTxResult`](RunTxResult.md).[`amountSpent`](RunTxResult.md#amountspent) |
| <a id="blobgasused"></a> `blobGasUsed?` | `bigint` | This is the blob gas units times the fee per blob gas for 4844 transactions | [`RunTxResult`](RunTxResult.md).[`blobGasUsed`](RunTxResult.md#blobgasused) |
| <a id="bloom"></a> `bloom` | [`Bloom`](../../utils/classes/Bloom.md) | Bloom filter resulted from transaction | [`RunTxResult`](RunTxResult.md).[`bloom`](RunTxResult.md#bloom) |
| <a id="createdaddress"></a> `createdAddress?` | `Address` | Address of created account during transaction, if any | [`RunTxResult`](RunTxResult.md).[`createdAddress`](RunTxResult.md#createdaddress) |
| <a id="execresult"></a> `execResult` | [`ExecResult`](../../evm/interfaces/ExecResult.md) | Contains the results from running the code, if any, as described in runCode | [`RunTxResult`](RunTxResult.md).[`execResult`](RunTxResult.md#execresult) |
| <a id="gasrefund"></a> `gasRefund` | `bigint` | The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`) | [`RunTxResult`](RunTxResult.md).[`gasRefund`](RunTxResult.md#gasrefund) |
| <a id="minervalue"></a> `minerValue` | `bigint` | The value that accrues to the miner by this transaction | [`RunTxResult`](RunTxResult.md).[`minerValue`](RunTxResult.md#minervalue) |
| <a id="preimages"></a> `preimages?` | `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\> | Preimages mapping of the touched accounts from the tx (see `reportPreimages` option) | [`RunTxResult`](RunTxResult.md).[`preimages`](RunTxResult.md#preimages) |
| <a id="receipt"></a> `receipt` | [`TxReceipt`](../type-aliases/TxReceipt.md) | The tx receipt | [`RunTxResult`](RunTxResult.md).[`receipt`](RunTxResult.md#receipt) |
| <a id="totalgasspent"></a> `totalGasSpent` | `bigint` | The amount of gas used in this transaction, which is paid for This contains the gas units that have been used on execution, plus the upfront cost, which consists of calldata cost, intrinsic cost and optionally the access list costs | [`RunTxResult`](RunTxResult.md).[`totalGasSpent`](RunTxResult.md#totalgasspent) |
| <a id="transaction"></a> `transaction` | [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) | The transaction which just got finished | - |
