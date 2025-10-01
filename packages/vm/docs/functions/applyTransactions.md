[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / applyTransactions

# Function: applyTransactions()

> **applyTransactions**(`vm`): (`block`, `opts`) => `Promise`\<\{ `bloom`: `Bloom`; `gasUsed`: `bigint`; `preimages`: `Map`\<`string`, `Uint8Array`\<`ArrayBufferLike`\>\>; `receipts`: [`TxReceipt`](../type-aliases/TxReceipt.md)[]; `receiptsRoot`: `Uint8Array`\<`ArrayBufferLike`\>; `results`: [`RunTxResult`](../interfaces/RunTxResult.md)[]; \}\>

Defined in: [packages/vm/src/actions/applyTransactions.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/applyTransactions.ts#L18)

Applies the transactions in a block, computing the receipts
as well as gas usage and some relevant data. This method is
side-effect free (it doesn't modify the block nor the state).

## Parameters

### vm

`BaseVm`

## Returns

> (`block`, `opts`): `Promise`\<\{ `bloom`: `Bloom`; `gasUsed`: `bigint`; `preimages`: `Map`\<`string`, `Uint8Array`\<`ArrayBufferLike`\>\>; `receipts`: [`TxReceipt`](../type-aliases/TxReceipt.md)[]; `receiptsRoot`: `Uint8Array`\<`ArrayBufferLike`\>; `results`: [`RunTxResult`](../interfaces/RunTxResult.md)[]; \}\>

### Parameters

#### block

`Block`

#### opts

[`RunBlockOpts`](../interfaces/RunBlockOpts.md)

### Returns

`Promise`\<\{ `bloom`: `Bloom`; `gasUsed`: `bigint`; `preimages`: `Map`\<`string`, `Uint8Array`\<`ArrayBufferLike`\>\>; `receipts`: [`TxReceipt`](../type-aliases/TxReceipt.md)[]; `receiptsRoot`: `Uint8Array`\<`ArrayBufferLike`\>; `results`: [`RunTxResult`](../interfaces/RunTxResult.md)[]; \}\>
