[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / AfterTxEvent

# Interface: AfterTxEvent

Defined in: [packages/vm/src/utils/AfterTxEvent.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/AfterTxEvent.ts#L20)

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

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="accesslist"></a> `accessList?` | `AccessList` | EIP-2930 access list generated for the tx (see `reportAccessList` option) | [`RunTxResult`](RunTxResult.md).[`accessList`](RunTxResult.md#accesslist) | [packages/vm/src/utils/RunTxResult.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L41) |
| <a id="amountspent"></a> `amountSpent` | `bigint` | The amount of ether used by this transaction | [`RunTxResult`](RunTxResult.md).[`amountSpent`](RunTxResult.md#amountspent) | [packages/vm/src/utils/RunTxResult.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L19) |
| <a id="blobgasused"></a> `blobGasUsed?` | `bigint` | This is the blob gas units times the fee per blob gas for 4844 transactions | [`RunTxResult`](RunTxResult.md).[`blobGasUsed`](RunTxResult.md#blobgasused) | [packages/vm/src/utils/RunTxResult.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L56) |
| <a id="bloom"></a> `bloom` | `Bloom` | Bloom filter resulted from transaction | [`RunTxResult`](RunTxResult.md).[`bloom`](RunTxResult.md#bloom) | [packages/vm/src/utils/RunTxResult.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L14) |
| <a id="createdaddress"></a> `createdAddress?` | `Address` | Address of created account during transaction, if any | [`RunTxResult`](RunTxResult.md).[`createdAddress`](RunTxResult.md#createdaddress) | node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:331 |
| <a id="execresult"></a> `execResult` | `ExecResult` | Contains the results from running the code, if any, as described in runCode | [`RunTxResult`](RunTxResult.md).[`execResult`](RunTxResult.md#execresult) | node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:335 |
| <a id="gasrefund"></a> `gasRefund` | `bigint` | The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`) | [`RunTxResult`](RunTxResult.md).[`gasRefund`](RunTxResult.md#gasrefund) | [packages/vm/src/utils/RunTxResult.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L36) |
| <a id="minervalue"></a> `minerValue` | `bigint` | The value that accrues to the miner by this transaction | [`RunTxResult`](RunTxResult.md).[`minerValue`](RunTxResult.md#minervalue) | [packages/vm/src/utils/RunTxResult.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L51) |
| <a id="preimages"></a> `preimages?` | `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\> | Preimages mapping of the touched accounts from the tx (see `reportPreimages` option) | [`RunTxResult`](RunTxResult.md).[`preimages`](RunTxResult.md#preimages) | [packages/vm/src/utils/RunTxResult.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L46) |
| <a id="receipt"></a> `receipt` | [`TxReceipt`](../type-aliases/TxReceipt.md) | The tx receipt | [`RunTxResult`](RunTxResult.md).[`receipt`](RunTxResult.md#receipt) | [packages/vm/src/utils/RunTxResult.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L24) |
| <a id="totalgasspent"></a> `totalGasSpent` | `bigint` | The amount of gas used in this transaction, which is paid for This contains the gas units that have been used on execution, plus the upfront cost, which consists of calldata cost, intrinsic cost and optionally the access list costs | [`RunTxResult`](RunTxResult.md).[`totalGasSpent`](RunTxResult.md#totalgasspent) | [packages/vm/src/utils/RunTxResult.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L31) |
| <a id="transaction"></a> `transaction` | `TypedTransaction` | The transaction which just got finished | - | [packages/vm/src/utils/AfterTxEvent.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/AfterTxEvent.ts#L24) |
