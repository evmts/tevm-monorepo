[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / ApplyBlockResult

# Interface: ApplyBlockResult

Result of [applyBlock](../variables/applyBlock.md)

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="bloom"></a> `bloom` | [`Bloom`](../../utils/classes/Bloom.md) | The Bloom filter |
| <a id="gasused"></a> `gasUsed` | `bigint` | The gas used after executing the block |
| <a id="preimages"></a> `preimages?` | `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\> | Preimages mapping of the touched accounts from the block (see reportPreimages option) |
| <a id="receipts"></a> `receipts` | [`TxReceipt`](../type-aliases/TxReceipt.md)[] | Receipts generated for transactions in the block |
| <a id="receiptsroot"></a> `receiptsRoot` | `Uint8Array` | The receipt root after executing the block |
| <a id="results"></a> `results` | [`RunTxResult`](RunTxResult.md)[] | Results of executing the transactions in the block |
