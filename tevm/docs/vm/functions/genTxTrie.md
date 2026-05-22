[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [vm](../README.md) / genTxTrie

# Function: genTxTrie()

> **genTxTrie**(`block`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Generate the transaction trie for a block.
This is an intermediate step for computing the block header's
transaction root.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `block` | [`Block`](../../block/classes/Block.md) | The block to generate the transaction trie for |

## Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

The transaction trie root
