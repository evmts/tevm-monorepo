[**@tevm/vm**](../README.md)

***

[@tevm/vm](../globals.md) / genTxTrie

# Function: genTxTrie()

> **genTxTrie**(`block`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [packages/vm/src/actions/genTxTrie.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/vm/src/actions/genTxTrie.ts#L13)

Generate the transaction trie for a block.
This is an intermediate step for computing the block header's
transaction root.

## Parameters

### block

`Block`

The block to generate the transaction trie for

## Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

The transaction trie root
