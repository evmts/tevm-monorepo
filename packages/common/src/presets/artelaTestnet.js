// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the artelaTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 11822
 * Chain Name: Artela Testnet
 * Default Block Explorer: https://betanet-scan.artela.network
 * Default RPC URL: https://betanet-rpc1.artela.network
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { artelaTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: artelaTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const artelaTestnet = createCommon({
	...nativeDefineChain({
		id: 11822,
		name: 'Artela Testnet',
		nativeCurrency: {
			name: 'ART',
			symbol: 'ART',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://betanet-rpc1.artela.network'],
			},
		},
		blockExplorers: {
			default: {
				name: 'ArtelaScan',
				url: 'https://betanet-scan.artela.network',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 0,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
