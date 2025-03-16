import { type BlockTag } from '@tevm/utils'
import { type EIP1193RequestFn, type Transport } from 'viem'

/**
 * Configuration options for forking from an existing blockchain network.
 * Used to specify the RPC endpoint and block number to fork from.
 * @example
 * ```typescript
 * import { ForkOptions } from '@tevm/state'
 * import { http } from 'viem'
 *
 * const value: ForkOptions = {
 *   transport: http('https://mainnet.infura.io/v3/your-api-key'),
 *   blockTag: 'latest'
 * }
 * ```
 */
export interface ForkOptions {
	transport: { request: EIP1193RequestFn } | Transport
	blockTag?: BlockTag | bigint
}
