// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the baseGoerli chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 84531
 * Chain Name: Base Goerli
 * Default Block Explorer: https://goerli.basescan.org
 * Default RPC URL: https://goerli.base.org
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { baseGoerli } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: baseGoerli,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const baseGoerli = createCommon({
	...nativeDefineChain({
		id: 84531,
		name: 'Base Goerli',
		nativeCurrency: {
			name: 'Goerli Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://goerli.base.org'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Basescan',
				url: 'https://goerli.basescan.org',
				apiUrl: 'https://goerli.basescan.org/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 1376988,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
