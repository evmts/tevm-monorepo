// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the arbitrumGoerli chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 421613
 * Chain Name: Arbitrum Goerli
 * Default Block Explorer: https://goerli.arbiscan.io
 * Default RPC URL: https://goerli-rollup.arbitrum.io/rpc
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { arbitrumGoerli } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: arbitrumGoerli,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const arbitrumGoerli = createCommon({
	...nativeDefineChain({
		id: 421613,
		name: 'Arbitrum Goerli',
		nativeCurrency: {
			name: 'Arbitrum Goerli Ether',
			symbol: 'AGOR',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://goerli-rollup.arbitrum.io/rpc'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Arbiscan',
				url: 'https://goerli.arbiscan.io',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 88114,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
