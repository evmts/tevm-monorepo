import type { BlockParam } from './BlockParam.js'

/**
 * Represents a configuration for a forked or proxied network
 */
export type NetworkConfig = {
	/**
	 * The URL to the RPC endpoint
	 */
	url: string
	/**
	 * the block tag to fork from
	 */
	blockTag: BlockParam
}
