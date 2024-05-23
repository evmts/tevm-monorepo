import { type BlockTag } from '@tevm/utils'
import { type EIP1193RequestFn } from 'viem'

export interface ForkOptions {
	transport: { request: EIP1193RequestFn }
	blockTag?: BlockTag | bigint
}
