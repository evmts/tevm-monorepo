/**
 * @module tevmChainToViemChain
 *
 * Converts a @tevm/chains chain definition to a viem-compatible Chain format.
 * This enables using native chain data from @tevm/chains without viem dependency.
 */

/**
 * Chain type from @tevm/chains (defined inline to avoid external dependency)
 * @typedef {Object} TevmChainExplorer
 * @property {string} name - Explorer name
 * @property {string} url - Explorer URL
 * @property {string} [standard] - Explorer standard (e.g., 'EIP3091')
 */

/**
 * @typedef {Object} TevmChainNativeCurrency
 * @property {string} name - Currency name
 * @property {string} symbol - Currency symbol
 * @property {number} decimals - Decimal places
 */

/**
 * @typedef {Object} TevmChain
 * @property {number} chainId - Chain ID
 * @property {string} name - Chain name
 * @property {string} [chain] - Chain shortname
 * @property {string} [shortName] - Short name
 * @property {string[]} [rpc] - RPC URLs
 * @property {TevmChainNativeCurrency} [nativeCurrency] - Native currency info
 * @property {TevmChainExplorer[]} [explorers] - Block explorers
 * @property {boolean} [testnet] - Whether it's a testnet
 */

/**
 * Convert a @tevm/chains chain definition to viem-compatible Chain format.
 *
 * The @tevm/chains package provides chain data from DefiLlama/chainlist in a simple format.
 * This function converts that format to the more complex viem Chain format that's
 * used throughout TEVM.
 *
 * @param {TevmChain} tevmChain - Chain from @tevm/chains
 * @returns {import('./chain-types.js').Chain} viem-compatible Chain object
 *
 * @example
 * ```javascript
 * import { tevmChainToViemChain } from '@tevm/utils'
 * import { chainById } from '@tevm/chains'
 *
 * // Get a chain from @tevm/chains by ID
 * const tevmFlare = chainById[14] // Flare Mainnet
 *
 * // Convert to viem-compatible format
 * const flare = tevmChainToViemChain(tevmFlare)
 *
 * // Now usable with TEVM memory client
 * import { createMemoryClient } from '@tevm/memory-client'
 * const client = createMemoryClient({ common: flare })
 * ```
 *
 * @example
 * ```javascript
 * // Chain format conversion details:
 * //
 * // @tevm/chains format:
 * // {
 * //   chainId: 14,
 * //   name: 'Flare Mainnet',
 * //   chain: 'FLR',
 * //   shortName: 'flr',
 * //   rpc: ['https://flare-api.flare.network/ext/C/rpc', ...],
 * //   nativeCurrency: { name: 'Flare', symbol: 'FLR', decimals: 18 },
 * //   explorers: [{ name: 'Flarescan', url: 'https://flarescan.com', ... }],
 * // }
 * //
 * // Converted to viem Chain format:
 * // {
 * //   id: 14,
 * //   name: 'Flare Mainnet',
 * //   nativeCurrency: { name: 'Flare', symbol: 'FLR', decimals: 18 },
 * //   rpcUrls: {
 * //     default: { http: ['https://flare-api.flare.network/ext/C/rpc', ...] }
 * //   },
 * //   blockExplorers: {
 * //     default: { name: 'Flarescan', url: 'https://flarescan.com' }
 * //   },
 * // }
 * ```
 */
export function tevmChainToViemChain(tevmChain) {
	const httpRpcs = (tevmChain.rpc || []).filter((rpc) => rpc.startsWith('http'))
	const wsRpcs = (tevmChain.rpc || []).filter((rpc) => rpc.startsWith('ws'))

	/** @type {import('./chain-types.js').Chain} */
	const chain = {
		id: tevmChain.chainId,
		name: tevmChain.name,
		nativeCurrency: tevmChain.nativeCurrency || {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: httpRpcs.length > 0 ? httpRpcs : [''],
				...(wsRpcs.length > 0 ? { webSocket: wsRpcs } : {}),
			},
		},
	}

	// Add block explorers if available
	if (tevmChain.explorers && tevmChain.explorers.length > 0) {
		/** @type {TevmChainExplorer} */
		const defaultExplorer = /** @type {TevmChainExplorer} */ (tevmChain.explorers[0])
		chain.blockExplorers = {
			default: {
				name: defaultExplorer.name,
				url: defaultExplorer.url,
			},
		}

		// Add additional explorers
		for (let i = 1; i < tevmChain.explorers.length; i++) {
			/** @type {TevmChainExplorer} */
			const explorer = /** @type {TevmChainExplorer} */ (tevmChain.explorers[i])
			const key = explorer.name.toLowerCase().replace(/\s+/g, '')
			chain.blockExplorers[key] = {
				name: explorer.name,
				url: explorer.url,
			}
		}
	}

	// Add testnet flag if present
	if (tevmChain.testnet) {
		chain.testnet = true
	}

	return chain
}
