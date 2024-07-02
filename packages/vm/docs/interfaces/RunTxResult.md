[**@tevm/vm**](../README.md) • **Docs**

***

[@tevm/vm](../globals.md) / RunTxResult

# Interface: RunTxResult

Execution result of a transaction

## Extends

- `EVMResult`

## Extended by

- [`AfterTxEvent`](AfterTxEvent.md)

## Properties

### accessList?

> `optional` **accessList**: `AccessList`

EIP-2930 access list generated for the tx (see `reportAccessList` option)

#### Defined in

[packages/vm/src/utils/RunTxResult.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L41)

***

### amountSpent

> **amountSpent**: `bigint`

The amount of ether used by this transaction

#### Defined in

[packages/vm/src/utils/RunTxResult.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L19)

***

### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

This is the blob gas units times the fee per blob gas for 4844 transactions

#### Defined in

[packages/vm/src/utils/RunTxResult.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L56)

***

### bloom

> **bloom**: `Bloom`

Bloom filter resulted from transaction

#### Defined in

[packages/vm/src/utils/RunTxResult.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L14)

***

### createdAddress?

> `optional` **createdAddress**: `Address`

Address of created account during transaction, if any

#### Inherited from

`EvmResult.createdAddress`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:248

***

### execResult

> **execResult**: `ExecResult`

Contains the results from running the code, if any, as described in runCode

#### Inherited from

`EvmResult.execResult`

#### Defined in

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:252

***

### gasRefund

> **gasRefund**: `bigint`

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

#### Defined in

[packages/vm/src/utils/RunTxResult.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L36)

***

### minerValue

> **minerValue**: `bigint`

The value that accrues to the miner by this transaction

#### Defined in

[packages/vm/src/utils/RunTxResult.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L51)

***

### preimages?

> `optional` **preimages**: `Map`\<\`0x$\{string\}\`, `Uint8Array`\>

Preimages mapping of the touched accounts from the tx (see `reportPreimages` option)

#### Defined in

[packages/vm/src/utils/RunTxResult.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L46)

***

### receipt

> **receipt**: [`TxReceipt`](../type-aliases/TxReceipt.md)

The tx receipt

#### Defined in

[packages/vm/src/utils/RunTxResult.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L24)

***

### totalGasSpent

> **totalGasSpent**: `bigint`

The amount of gas used in this transaction, which is paid for
This contains the gas units that have been used on execution, plus the upfront cost,
which consists of calldata cost, intrinsic cost and optionally the access list costs

#### Defined in

[packages/vm/src/utils/RunTxResult.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L31)
