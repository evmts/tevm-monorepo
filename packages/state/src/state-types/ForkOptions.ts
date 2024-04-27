import { type BlockTag } from '@tevm/utils'

export interface ForkOptions {
	url: string
	blockTag?: BlockTag | bigint
}
