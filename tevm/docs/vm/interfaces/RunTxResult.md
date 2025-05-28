[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / RunTxResult

# Interface: RunTxResult

Defined in: packages/vm/types/utils/RunTxResult.d.ts:9

Execution result of a transaction

## Extends

- [`EvmResult`](../../evm/interfaces/EvmResult.md)

## Extended by

- [`AfterTxEvent`](AfterTxEvent.md)

## Properties

### accessList?

> `optional` **accessList**: [`AccessList`](../../tx/type-aliases/AccessList.md)

Defined in: packages/vm/types/utils/RunTxResult.d.ts:35

EIP-2930 access list generated for the tx (see `reportAccessList` option)

***

### amountSpent

> **amountSpent**: `bigint`

Defined in: packages/vm/types/utils/RunTxResult.d.ts:17

The amount of ether used by this transaction

***

### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

Defined in: packages/vm/types/utils/RunTxResult.d.ts:47

This is the blob gas units times the fee per blob gas for 4844 transactions

***

### bloom

> **bloom**: `Bloom`

Defined in: packages/vm/types/utils/RunTxResult.d.ts:13

Bloom filter resulted from transaction

***

### createdAddress?

> `optional` **createdAddress**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:333

Address of created account during transaction, if any

#### Inherited from

[`EvmResult`](../../evm/interfaces/EvmResult.md).[`createdAddress`](../../evm/interfaces/EvmResult.md#createdaddress)

***

### execResult

> **execResult**: [`ExecResult`](../../evm/interfaces/ExecResult.md)

Defined in: node\_modules/.pnpm/@ethereumjs+evm@10.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:337

Contains the results from running the code, if any, as described in runCode

#### Inherited from

[`EvmResult`](../../evm/interfaces/EvmResult.md).[`execResult`](../../evm/interfaces/EvmResult.md#execresult)

***

### gasRefund

> **gasRefund**: `bigint`

Defined in: packages/vm/types/utils/RunTxResult.d.ts:31

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

***

### minerValue

> **minerValue**: `bigint`

Defined in: packages/vm/types/utils/RunTxResult.d.ts:43

The value that accrues to the miner by this transaction

***

### preimages?

> `optional` **preimages**: `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: packages/vm/types/utils/RunTxResult.d.ts:39

Preimages mapping of the touched accounts from the tx (see `reportPreimages` option)

***

### receipt

> **receipt**: [`TxReceipt`](../type-aliases/TxReceipt.md)

Defined in: packages/vm/types/utils/RunTxResult.d.ts:21

The tx receipt

***

### totalGasSpent

> **totalGasSpent**: `bigint`

Defined in: packages/vm/types/utils/RunTxResult.d.ts:27

The amount of gas used in this transaction, which is paid for
This contains the gas units that have been used on execution, plus the upfront cost,
which consists of calldata cost, intrinsic cost and optionally the access list costs
