import { type BlockTag, type EIP1193RequestFn, type Transport } from '@tevm/utils'

/**
 * Configuration options for forking from an existing blockchain network.
 * Used to specify the RPC endpoint and block number to fork from.
 * @example
 * ```typescript
 * import { ForkOptions } from '@tevm/state'
 * import { http } from '@tevm/utils'
 *
 * const value: ForkOptions = {
 *   transport: http('https://mainnet.infura.io/v3/your-api-key'),
 *   blockTag: 'latest'
 * }
 * ```
 * @example
 * ```typescript
 * // Override chain ID to avoid wallet confusion when forking
 * import { ForkOptions } from '@tevm/state'
 * import { http } from '@tevm/utils'
 *
 * const value: ForkOptions = {
 *   transport: http('https://mainnet.optimism.io'),
 *   chainId: 1337, // Use a custom chain ID instead of Optimism's 10
 * }
 * ```
 */
export interface ForkOptions {
	transport: { request: EIP1193RequestFn } | Transport
	blockTag?: BlockTag | bigint
	/**
	 * Optional chain ID override.
	 * When set, this chain ID will be used instead of the one fetched from the fork RPC.
	 * This is useful to avoid wallet confusion (e.g., MetaMask) when the same chain ID
	 * is used for both the fork and the original network.
	 * @example
	 * ```typescript
	 * const client = createMemoryClient({
	 *   fork: {
	 *     transport: http('https://mainnet.optimism.io'),
	 *     chainId: 1337, // Override Optimism's chain ID (10) with a custom one
	 *   },
	 * })
	 * ```
	 */
	chainId?: number
}
