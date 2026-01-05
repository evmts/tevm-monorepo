// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the ancient8Sepolia chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 28122024
 * Chain Name: Ancient8 Testnet
 * Default Block Explorer: https://scanv2-testnet.ancient8.gg
 * Default RPC URL: https://rpcv2-testnet.ancient8.gg
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { ancient8Sepolia } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: ancient8Sepolia,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const ancient8Sepolia = createCommon({
	...nativeDefineChain({
		id: 28122024,
		name: 'Ancient8 Testnet',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://rpcv2-testnet.ancient8.gg'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Ancient8 Celestia Testnet explorer',
				url: 'https://scanv2-testnet.ancient8.gg',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 0,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
