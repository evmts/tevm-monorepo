import { type BlockTag, type Hex, isHex, type RpcBlockIdentifier } from 'viem'

export const normalizeBlockTag = (tag: BlockTag | Hex | RpcBlockIdentifier | undefined) => {
	if (typeof tag === 'object' && 'blockHash' in tag && tag.blockHash !== undefined) {
		return tag.blockHash.toLowerCase()
	}
	if (typeof tag === 'object' && 'blockNumber' in tag && tag.blockNumber !== undefined) {
		return tag.blockNumber.toLowerCase()
	}
	if (typeof tag === 'string' && isHex(tag)) {
		return tag.toLowerCase()
	}

	throw new Error('Invalid block tag') // this should never happen as it would have been filtered out by isCachedJsonRpcMethod
}
