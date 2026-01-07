// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the mainnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1
 * Chain Name: Ethereum
 * Default Block Explorer: https://etherscan.io
 * Default RPC URL: https://eth.merkle.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { mainnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: mainnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const mainnet = createCommon({
	...nativeDefineChain({
		id: 1,
		name: 'Ethereum',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		blockTime: 12000,
		rpcUrls: {
			default: {
				http: ['https://eth.merkle.io'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Etherscan',
				url: 'https://etherscan.io',
				apiUrl: 'https://api.etherscan.io/api',
			},
		},
		contracts: {
			ensUniversalResolver: {
				address: '0xeeeeeeee14d718c2b47d9923deab1335e144eeee',
				blockCreated: 23085558,
			},
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 14353601,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
