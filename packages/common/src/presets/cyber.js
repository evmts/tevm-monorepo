// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the cyber chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 7560
 * Chain Name: Cyber
 * Default Block Explorer: https://cyberscan.co
 * Default RPC URL: https://cyber.alt.technology
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { cyber } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: cyber,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const cyber = createCommon({
	...nativeDefineChain({
		id: 7560,
		name: 'Cyber',
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://cyber.alt.technology'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Blockscout',
				url: 'https://cyberscan.co',
				apiUrl: 'https://cyberscan.co/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 0,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
