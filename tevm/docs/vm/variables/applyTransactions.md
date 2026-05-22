[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / applyTransactions

# Variable: applyTransactions

> `const` **applyTransactions**: (`vm`) => (`block`, `opts`) => `Promise`\<\{ `bloom`: [`Bloom`](../../utils/classes/Bloom.md); `gasUsed`: `bigint`; `preimages`: `Map`\<`string`, `Uint8Array`\<`ArrayBufferLike`\>\>; `receipts`: [`TxReceipt`](../type-aliases/TxReceipt.md)[]; `receiptsRoot`: `Uint8Array`\<`ArrayBufferLike`\>; `results`: [`RunTxResult`](../interfaces/RunTxResult.md)[]; \}\>

Applies the transactions in a block, computing the receipts
as well as gas usage and some relevant data. This method is
side-effect free (it doesn't modify the block nor the state).

## Parameters

| Parameter | Type |
| ------ | ------ |
| `vm` | `BaseVm` |

## Returns

(`block`, `opts`) => `Promise`\<\{ `bloom`: [`Bloom`](../../utils/classes/Bloom.md); `gasUsed`: `bigint`; `preimages`: `Map`\<`string`, `Uint8Array`\<`ArrayBufferLike`\>\>; `receipts`: [`TxReceipt`](../type-aliases/TxReceipt.md)[]; `receiptsRoot`: `Uint8Array`\<`ArrayBufferLike`\>; `results`: [`RunTxResult`](../interfaces/RunTxResult.md)[]; \}\>
