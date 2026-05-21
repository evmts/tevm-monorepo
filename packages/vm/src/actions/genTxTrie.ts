import { Rlp } from '@evmts/zevm/rlp'
import { Trie } from '@evmts/zevm/trie'
import { Block } from '@tevm/block'
import { KECCAK256_RLP } from '@tevm/utils'

/**
 * Generate the transaction trie for a block.
 * This is an intermediate step for computing the block header's
 * transaction root.
 * @param block - The block to generate the transaction trie for
 * @returns The transaction trie root
 */
export async function genTxTrie(block: Block) {
	if (block.transactions.length === 0) {
		return KECCAK256_RLP
	}
	const trie = new Trie({ common: block.common.ethjsCommon })
	for (let i = 0; i < block.transactions.length; i++) {
		const tx = block.transactions[i]
		if (tx) {
			await trie.put(Rlp.encode(i), tx.serialize())
		}
	}
	return trie.root()
}
