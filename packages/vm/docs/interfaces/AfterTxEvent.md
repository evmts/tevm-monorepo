[**@tevm/vm**](../README.md) • **Docs**

***

[@tevm/vm](../globals.md) / AfterTxEvent

# Interface: AfterTxEvent

Execution result of a transaction

## Extends

- [`RunTxResult`](RunTxResult.md)

## Properties

### accessList?

> `optional` **accessList**: `AccessList`

EIP-2930 access list generated for the tx (see `reportAccessList` option)

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`accessList`](RunTxResult.md#accesslist)

#### Defined in

[packages/vm/src/utils/RunTxResult.ts:41](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L41)

***

### amountSpent

> **amountSpent**: `bigint`

The amount of ether used by this transaction

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`amountSpent`](RunTxResult.md#amountspent)

#### Defined in

[packages/vm/src/utils/RunTxResult.ts:19](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L19)

***

### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

This is the blob gas units times the fee per blob gas for 4844 transactions

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`blobGasUsed`](RunTxResult.md#blobgasused)

#### Defined in

[packages/vm/src/utils/RunTxResult.ts:56](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L56)

***

### bloom

> **bloom**: `Bloom`

Bloom filter resulted from transaction

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`bloom`](RunTxResult.md#bloom)

#### Defined in

[packages/vm/src/utils/RunTxResult.ts:14](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L14)

***

### createdAddress?

> `optional` **createdAddress**: `Address`

Address of created account during transaction, if any

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`createdAddress`](RunTxResult.md#createdaddress)

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:273

***

### execResult

> **execResult**: `ExecResult`

Contains the results from running the code, if any, as described in runCode

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`execResult`](RunTxResult.md#execresult)

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.1.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:277

***

### gasRefund

> **gasRefund**: `bigint`

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`gasRefund`](RunTxResult.md#gasrefund)

#### Defined in

[packages/vm/src/utils/RunTxResult.ts:36](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L36)

***

### minerValue

> **minerValue**: `bigint`

The value that accrues to the miner by this transaction

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`minerValue`](RunTxResult.md#minervalue)

#### Defined in

[packages/vm/src/utils/RunTxResult.ts:51](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L51)

***

### preimages?

> `optional` **preimages**: `Map`\<\`0x$\{string\}\`, `Uint8Array`\>

Preimages mapping of the touched accounts from the tx (see `reportPreimages` option)

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`preimages`](RunTxResult.md#preimages)

#### Defined in

[packages/vm/src/utils/RunTxResult.ts:46](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L46)

***

### receipt

> **receipt**: [`TxReceipt`](../type-aliases/TxReceipt.md)

The tx receipt

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`receipt`](RunTxResult.md#receipt)

#### Defined in

[packages/vm/src/utils/RunTxResult.ts:24](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L24)

***

### totalGasSpent

> **totalGasSpent**: `bigint`

The amount of gas used in this transaction, which is paid for
This contains the gas units that have been used on execution, plus the upfront cost,
which consists of calldata cost, intrinsic cost and optionally the access list costs

#### Inherited from

[`RunTxResult`](RunTxResult.md).[`totalGasSpent`](RunTxResult.md#totalgasspent)

#### Defined in

[packages/vm/src/utils/RunTxResult.ts:31](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L31)

***

### transaction

> **transaction**: `TypedTransaction`

The transaction which just got finished

#### Defined in

[packages/vm/src/utils/AfterTxEvent.ts:8](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/vm/src/utils/AfterTxEvent.ts#L8)
