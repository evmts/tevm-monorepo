import type { Common } from '@tevm/common'
import type { AbstractLevel } from 'abstract-level'
import type { BlockTag } from 'viem'

export type ChainOptions = {
	common: Common
	fork?: {
		url: string
		blockTag?: BlockTag | bigint
	}
	metaDB: AbstractLevel<string | Uint8Array, string | Uint8Array, string | Uint8Array>
}
