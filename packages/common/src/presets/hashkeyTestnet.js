// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the hashkeyTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 133
 * Chain Name: HashKey Chain Testnet
 * Default Block Explorer: https://hashkeychain-testnet-explorer.alt.technology
 * Default RPC URL: https://hashkeychain-testnet.alt.technology
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { hashkeyTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: hashkeyTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const hashkeyTestnet = createCommon({
	...nativeDefineChain({
		id: 133,
		name: 'HashKey Chain Testnet',
		nativeCurrency: {
			name: 'HSK',
			symbol: 'HSK',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://hashkeychain-testnet.alt.technology'],
			},
		},
		blockExplorers: {
			default: {
				name: 'HashKey Chain Testnet Explorer',
				url: 'https://hashkeychain-testnet-explorer.alt.technology',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
