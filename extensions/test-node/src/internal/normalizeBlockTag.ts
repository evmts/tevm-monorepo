import type { BlockTag } from '@tevm/actions'
import { type Hex, isHex } from 'viem'

export const normalizeBlockTag = (tag: BlockTag | Hex | undefined) => {
	if (!tag || !isHex(tag)) throw new Error('Invalid block tag') // this should never happen as it would have been filtered out by isCachedJsonRpcMethod
	return tag.toLowerCase()
}
