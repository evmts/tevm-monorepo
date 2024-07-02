[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [vm](../README.md) / AfterTxEvent

# Interface: AfterTxEvent

Execution result of a transaction

## Extends

- [`RunTxResult`](RunTxResult.md)

## Properties

### accessList?

> `optional` **accessList**: [`AccessList`](../../tx/type-aliases/AccessList.md)

EIP-2930 access list generated for the tx (see `reportAccessList` option)

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`accessList`](RunTxResult.md#accesslist)

#### Defined in

packages/vm/types/utils/RunTxResult.d.ts:35

***

### amountSpent

> **amountSpent**: `bigint`

The amount of ether used by this transaction

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`amountSpent`](RunTxResult.md#amountspent)

#### Defined in

packages/vm/types/utils/RunTxResult.d.ts:17

***

### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

This is the blob gas units times the fee per blob gas for 4844 transactions

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`blobGasUsed`](RunTxResult.md#blobgasused)

#### Defined in

packages/vm/types/utils/RunTxResult.d.ts:47

***

### bloom

> **bloom**: `Bloom`

Bloom filter resulted from transaction

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`bloom`](RunTxResult.md#bloom)

#### Defined in

packages/vm/types/utils/RunTxResult.d.ts:13

***

### createdAddress?

> `optional` **createdAddress**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

Address of created account during transaction, if any

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`createdAddress`](RunTxResult.md#createdaddress)

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:248

***

### execResult

> **execResult**: [`ExecResult`](../../evm/interfaces/ExecResult.md)

Contains the results from running the code, if any, as described in runCode

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`execResult`](RunTxResult.md#execresult)

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:252

***

### gasRefund

> **gasRefund**: `bigint`

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`gasRefund`](RunTxResult.md#gasrefund)

#### Defined in

packages/vm/types/utils/RunTxResult.d.ts:31

***

### minerValue

> **minerValue**: `bigint`

The value that accrues to the miner by this transaction

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`minerValue`](RunTxResult.md#minervalue)

#### Defined in

packages/vm/types/utils/RunTxResult.d.ts:43

***

### preimages?

> `optional` **preimages**: `Map`\<\`0x$\{string\}\`, `Uint8Array`\>

Preimages mapping of the touched accounts from the tx (see `reportPreimages` option)

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`preimages`](RunTxResult.md#preimages)

#### Defined in

packages/vm/types/utils/RunTxResult.d.ts:39

***

### receipt

> **receipt**: [`TxReceipt`](../type-aliases/TxReceipt.md)

The tx receipt

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`receipt`](RunTxResult.md#receipt)

#### Defined in

packages/vm/types/utils/RunTxResult.d.ts:21

***

### totalGasSpent

> **totalGasSpent**: `bigint`

The amount of gas used in this transaction, which is paid for
This contains the gas units that have been used on execution, plus the upfront cost,
which consists of calldata cost, intrinsic cost and optionally the access list costs

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`totalGasSpent`](RunTxResult.md#totalgasspent)

#### Defined in

packages/vm/types/utils/RunTxResult.d.ts:27

***

### transaction

> **transaction**: [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md)

The transaction which just got finished

#### Defined in

packages/vm/types/utils/AfterTxEvent.d.ts:7
