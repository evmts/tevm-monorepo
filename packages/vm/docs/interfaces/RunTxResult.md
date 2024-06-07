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

#### Source

[packages/vm/src/utils/types.ts:439](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L439)

***

### amountSpent

> **amountSpent**: `bigint`

The amount of ether used by this transaction

#### Source

[packages/vm/src/utils/types.ts:417](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L417)

***

### blobGasUsed?

> `optional` **blobGasUsed**: `bigint`

This is the blob gas units times the fee per blob gas for 4844 transactions

#### Source

[packages/vm/src/utils/types.ts:454](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L454)

***

### bloom

> **bloom**: `Bloom`

Bloom filter resulted from transaction

#### Source

[packages/vm/src/utils/types.ts:412](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L412)

***

### createdAddress?

> `optional` **createdAddress**: `Address`

Address of created account during transaction, if any

#### Inherited from

`EvmResult.createdAddress`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:248

***

### execResult

> **execResult**: `ExecResult`

Contains the results from running the code, if any, as described in runCode

#### Inherited from

`EvmResult.execResult`

#### Source

node\_modules/.pnpm/@ethereumjs+evm@3.0.0/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:252

***

### gasRefund

> **gasRefund**: `bigint`

The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`)

#### Source

[packages/vm/src/utils/types.ts:434](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L434)

***

### minerValue

> **minerValue**: `bigint`

The value that accrues to the miner by this transaction

#### Source

[packages/vm/src/utils/types.ts:449](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L449)

***

### preimages?

> `optional` **preimages**: `Map`\<\`0x$\{string\}\`, `Uint8Array`\>

Preimages mapping of the touched accounts from the tx (see `reportPreimages` option)

#### Source

[packages/vm/src/utils/types.ts:444](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L444)

***

### receipt

> **receipt**: [`TxReceipt`](../type-aliases/TxReceipt.md)

The tx receipt

#### Source

[packages/vm/src/utils/types.ts:422](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L422)

***

### totalGasSpent

> **totalGasSpent**: `bigint`

The amount of gas used in this transaction, which is paid for
This contains the gas units that have been used on execution, plus the upfront cost,
which consists of calldata cost, intrinsic cost and optionally the access list costs

#### Source

[packages/vm/src/utils/types.ts:429](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/types.ts#L429)
