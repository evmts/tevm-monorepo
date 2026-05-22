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

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="accesslist"></a> `accessList?` | `AccessList` | EIP-2930 access list generated for the tx (see `reportAccessList` option) | - | [packages/vm/src/utils/RunTxResult.ts:41](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L41) |
| <a id="amountspent"></a> `amountSpent` | `bigint` | The amount of ether used by this transaction | - | [packages/vm/src/utils/RunTxResult.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L19) |
| <a id="blobgasused"></a> `blobGasUsed?` | `bigint` | This is the blob gas units times the fee per blob gas for 4844 transactions | - | [packages/vm/src/utils/RunTxResult.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L56) |
| <a id="bloom"></a> `bloom` | `Bloom` | Bloom filter resulted from transaction | - | [packages/vm/src/utils/RunTxResult.ts:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L14) |
| <a id="createdaddress"></a> `createdAddress?` | `Address` | Address of created account during transaction, if any | `EvmResult.createdAddress` | node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:331 |
| <a id="execresult"></a> `execResult` | `ExecResult` | Contains the results from running the code, if any, as described in runCode | `EvmResult.execResult` | node\_modules/.pnpm/@ethereumjs+evm@10.1.1/node\_modules/@ethereumjs/evm/dist/esm/types.d.ts:335 |
| <a id="gasrefund"></a> `gasRefund` | `bigint` | The amount of gas as that was refunded during the transaction (i.e. `gasUsed = totalGasConsumed - gasRefund`) | - | [packages/vm/src/utils/RunTxResult.ts:36](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L36) |
| <a id="minervalue"></a> `minerValue` | `bigint` | The value that accrues to the miner by this transaction | - | [packages/vm/src/utils/RunTxResult.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L51) |
| <a id="preimages"></a> `preimages?` | `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\> | Preimages mapping of the touched accounts from the tx (see `reportPreimages` option) | - | [packages/vm/src/utils/RunTxResult.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L46) |
| <a id="receipt"></a> `receipt` | [`TxReceipt`](../type-aliases/TxReceipt.md) | The tx receipt | - | [packages/vm/src/utils/RunTxResult.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L24) |
| <a id="totalgasspent"></a> `totalGasSpent` | `bigint` | The amount of gas used in this transaction, which is paid for This contains the gas units that have been used on execution, plus the upfront cost, which consists of calldata cost, intrinsic cost and optionally the access list costs | - | [packages/vm/src/utils/RunTxResult.ts:31](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/utils/RunTxResult.ts#L31) |
