[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [vm](../README.md) / RunTxResult

# Interface: RunTxResult

Execution result of a transaction

## Extends

- [`EvmResult`](../../evm/interfaces/EvmResult.md)

## Extended by

- [`AfterTxEvent`](AfterTxEvent.md)

## Properties

### accessList?

> `optional` **accessList**: [`AccessList`](../../tx/type-aliases/AccessList.md)

EIP-2930 access list generated for the tx (see `reportAccessList` option)

#### Defined in

packages/vm/types/utils/RunTxResult.d.ts:35

***

### amountSpent

> **amountSpent**: `bigint`

The amount of ether used by this transaction

#### Defined in

packages/vm/types/utils/RunTxResult.d.ts:17

***

### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

This is the blob gas units times the fee per blob gas for 4844 transactions

#### Defined in

packages/vm/types/utils/RunTxResult.d.ts:47

***

### bloom

> **bloom**: `Bloom`

Bloom filter resulted from transaction

#### Defined in

packages/vm/types/utils/RunTxResult.d.ts:13

***

### createdAddress?

> `optional` **createdAddress**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Address of created account during transaction, if any

#### Inherited from

[`EvmResult`](../../evm/interfaces/EvmResult.md).[`createdAddress`](../../evm/interfaces/EvmResult.md#createdaddress)

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:273

***

### execResult

> **execResult**: [`ExecResult`](../../evm/interfaces/ExecResult.md)

Contains the results from running the code, if any, as described in runCode

#### Inherited from

[`EvmResult`](../../evm/interfaces/EvmResult.md).[`execResult`](../../evm/interfaces/EvmResult.md#execresult)

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:277

***

### gasRefund

> **gasRefund**: `bigint`

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

#### Defined in

packages/vm/types/utils/RunTxResult.d.ts:31

***

### minerValue

> **minerValue**: `bigint`

The value that accrues to the miner by this transaction

#### Defined in

packages/vm/types/utils/RunTxResult.d.ts:43

***

### preimages?

> `optional` **preimages**: `Map`\<\`0x$\{string\}\`, `Uint8Array`\>

Preimages mapping of the touched accounts from the tx (see `reportPreimages` option)

#### Defined in

packages/vm/types/utils/RunTxResult.d.ts:39

***

### receipt

> **receipt**: [`TxReceipt`](../type-aliases/TxReceipt.md)

The tx receipt

#### Defined in

packages/vm/types/utils/RunTxResult.d.ts:21

***

### totalGasSpent

> **totalGasSpent**: `bigint`

The amount of gas used in this transaction, which is paid for
This contains the gas units that have been used on execution, plus the upfront cost,
which consists of calldata cost, intrinsic cost and optionally the access list costs

#### Defined in

packages/vm/types/utils/RunTxResult.d.ts:27
