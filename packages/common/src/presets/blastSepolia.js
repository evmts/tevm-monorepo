// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the blastSepolia chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 168587773
 * Chain Name: Blast Sepolia
 * Default Block Explorer: https://sepolia.blastscan.io
 * Default RPC URL: https://sepolia.blast.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { blastSepolia } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: blastSepolia,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const blastSepolia = createCommon({
	...nativeDefineChain({
		id: 168587773,
		name: 'Blast Sepolia',
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://sepolia.blast.io'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Blastscan',
				url: 'https://sepolia.blastscan.io',
				apiUrl: 'https://api-sepolia.blastscan.io/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 756690,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
