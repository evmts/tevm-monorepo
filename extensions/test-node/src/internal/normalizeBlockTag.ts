import { type BlockTag, type Hex, type RpcBlockIdentifier } from '@tevm/utils'

/**
 * Normalizes a block tag to a consistent lowercase string for cache key generation.
 * Supports block hashes, block numbers, and named block tags (latest, pending, etc.).
 *
 * @param tag - The block identifier to normalize. Can be:
 *   - A block tag string ('latest', 'pending', 'earliest', 'safe', 'finalized')
 *   - A hex block number ('0x1234')
 *   - An RpcBlockIdentifier object with blockHash or blockNumber
 * @returns The normalized lowercase string representation
 * @throws Error if the tag format is invalid (should not happen in normal usage)
 *
 * @example
 * ```typescript
 * import { normalizeBlockTag } from '@tevm/test-node'
 *
 * normalizeBlockTag('latest') // 'latest'
 * normalizeBlockTag('0xABC123') // '0xabc123'
 * normalizeBlockTag({ blockHash: '0xABC...' }) // '0xabc...'
 * normalizeBlockTag({ blockNumber: '0x123' }) // '0x123'
 * ```
 */
export const normalizeBlockTag = (tag: BlockTag | Hex | RpcBlockIdentifier | undefined) => {
	if (typeof tag === 'object' && 'blockHash' in tag && tag.blockHash !== undefined) {
		return tag.blockHash.toLowerCase()
	}
	if (typeof tag === 'object' && 'blockNumber' in tag && tag.blockNumber !== undefined) {
		return tag.blockNumber.toLowerCase()
	}
	if (typeof tag === 'string') return tag.toLowerCase() // hex or block tag

	throw new Error('Invalid block tag') // this should never happen as it would have been filtered out by isCachedJsonRpcMethod
}
