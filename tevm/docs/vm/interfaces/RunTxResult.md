[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / RunTxResult

# Interface: RunTxResult

Execution result of a transaction

## Extends

- [`EvmResult`](../../evm/interfaces/EvmResult.md)

## Extended by

- [`AfterTxEvent`](AfterTxEvent.md)

## Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
| <a id="accesslist"></a> `accessList?` | [`AccessList`](../../tx/type-aliases/AccessList.md) | EIP-2930 access list generated for the tx (see `reportAccessList` option) | - |
| <a id="amountspent"></a> `amountSpent` | `bigint` | The amount of ether used by this transaction | - |
| <a id="blobgasused"></a> `blobGasUsed?` | `bigint` | This is the blob gas units times the fee per blob gas for 4844 transactions | - |
| <a id="bloom"></a> `bloom` | [`Bloom`](../../utils/classes/Bloom.md) | Bloom filter resulted from transaction | - |
| <a id="createdaddress"></a> `createdAddress?` | `Address` | Address of created account during transaction, if any | [`EvmResult`](../../evm/interfaces/EvmResult.md).[`createdAddress`](../../evm/interfaces/EvmResult.md#createdaddress) |
| <a id="execresult"></a> `execResult` | [`ExecResult`](../../evm/interfaces/ExecResult.md) | Contains the results from running the code, if any, as described in runCode | [`EvmResult`](../../evm/interfaces/EvmResult.md).[`execResult`](../../evm/interfaces/EvmResult.md#execresult) |
| <a id="gasrefund"></a> `gasRefund` | `bigint` | The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`) | - |
| <a id="minervalue"></a> `minerValue` | `bigint` | The value that accrues to the miner by this transaction | - |
| <a id="preimages"></a> `preimages?` | `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\> | Preimages mapping of the touched accounts from the tx (see `reportPreimages` option) | - |
| <a id="receipt"></a> `receipt` | [`TxReceipt`](../type-aliases/TxReceipt.md) | The tx receipt | - |
| <a id="totalgasspent"></a> `totalGasSpent` | `bigint` | The amount of gas used in this transaction, which is paid for This contains the gas units that have been used on execution, plus the upfront cost, which consists of calldata cost, intrinsic cost and optionally the access list costs | - |
