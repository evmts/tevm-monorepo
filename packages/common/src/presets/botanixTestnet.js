// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the botanixTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 3636
 * Chain Name: Botanix Testnet
 * Default Block Explorer: https://testnet.botanixscan.io
 * Default RPC URL: https://node.botanixlabs.dev
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { botanixTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: botanixTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const botanixTestnet = createCommon({
	...nativeDefineChain({
		id: 3636,
		name: 'Botanix Testnet',
		nativeCurrency: { name: 'Bitcoin', symbol: 'BTC', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://node.botanixlabs.dev'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Botanix Testnet Explorer',
				url: 'https://testnet.botanixscan.io',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
