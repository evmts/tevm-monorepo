import { type BlockTag } from '@tevm/utils'
import { type EIP1193RequestFn, type Transport } from 'viem'

export interface ForkOptions {
	transport: { request: EIP1193RequestFn } | Transport
	blockTag?: BlockTag | bigint
}
