// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the sepolia chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 11155111
 * Chain Name: Sepolia
 * Default Block Explorer: https://sepolia.etherscan.io
 * Default RPC URL: https://sepolia.drpc.org
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { sepolia } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: sepolia,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const sepolia = createCommon({
	...nativeDefineChain({
		id: 11155111,
		name: 'Sepolia',
		nativeCurrency: {
			name: 'Sepolia Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://sepolia.drpc.org'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Etherscan',
				url: 'https://sepolia.etherscan.io',
				apiUrl: 'https://api-sepolia.etherscan.io/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 751532,
			},
			ensUniversalResolver: {
				address: '0xeeeeeeee14d718c2b47d9923deab1335e144eeee',
				blockCreated: 8928790,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
