[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / RunTxResult

# Interface: RunTxResult

Defined in: [packages/vm/src/utils/RunTxResult.ts:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L10)

Execution result of a transaction

## Extends

- `EVMResult`

## Extended by

- [`AfterTxEvent`](AfterTxEvent.md)

## Properties

### accessList?

> `optional` **accessList**: `AccessList`

Defined in: [packages/vm/src/utils/RunTxResult.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L41)

EIP-2930 access list generated for the tx (see `reportAccessList` option)

***

### amountSpent

> **amountSpent**: `bigint`

Defined in: [packages/vm/src/utils/RunTxResult.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L19)

The amount of ether used by this transaction

***

### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

Defined in: [packages/vm/src/utils/RunTxResult.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L56)

This is the blob gas units times the fee per blob gas for 4844 transactions

***

### bloom

> **bloom**: `Bloom`

Defined in: [packages/vm/src/utils/RunTxResult.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L14)

Bloom filter resulted from transaction

***

### createdAddress?

> `optional` **createdAddress**: `Address`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:273

Address of created account during transaction, if any

#### Inherited from

`EvmResult.createdAddress`

***

### execResult

> **execResult**: `ExecResult`

Defined in: node\_modules/.pnpm/@ethereumjs+evm@3.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:277

Contains the results from running the code, if any, as described in runCode

#### Inherited from

`EvmResult.execResult`

***

### gasRefund

> **gasRefund**: `bigint`

Defined in: [packages/vm/src/utils/RunTxResult.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L36)

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

***

### minerValue

> **minerValue**: `bigint`

Defined in: [packages/vm/src/utils/RunTxResult.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L51)

The value that accrues to the miner by this transaction

***

### preimages?

> `optional` **preimages**: `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [packages/vm/src/utils/RunTxResult.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L46)

Preimages mapping of the touched accounts from the tx (see `reportPreimages` option)

***

### receipt

> **receipt**: [`TxReceipt`](../type-aliases/TxReceipt.md)

Defined in: [packages/vm/src/utils/RunTxResult.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L24)

The tx receipt

***

### totalGasSpent

> **totalGasSpent**: `bigint`

Defined in: [packages/vm/src/utils/RunTxResult.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L31)

The amount of gas used in this transaction, which is paid for
This contains the gas units that have been used on execution, plus the upfront cost,
which consists of calldata cost, intrinsic cost and optionally the access list costs
