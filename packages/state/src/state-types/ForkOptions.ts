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
 *   blockTag: 'latest',
 *   chainId: 1337 // Optional: Override the chain ID instead of auto-detecting
 * }
 * ```
 */
export interface ForkOptions {
	transport: { request: EIP1193RequestFn } | Transport
	blockTag?: BlockTag | bigint
	/**
	 * Optional chain ID override. If not provided, the chain ID will be auto-detected
	 * from the forked network. This is useful to avoid wallet confusion when working
	 * with forked chains that have the same chain ID as the original network.
	 */
	chainId?: number
}
