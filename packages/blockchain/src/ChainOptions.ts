import type { Block } from '@tevm/block'
import type { Common } from '@tevm/common'
import type { BlockTag } from 'viem'

export type ChainOptions = {
	common: Common
	genesisBlock?: Block
	genesisStateRoot?: Uint8Array
	fork?: {
		url: string
		blockTag?: BlockTag | bigint
	}
}
