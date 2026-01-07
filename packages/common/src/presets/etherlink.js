// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the etherlink chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 42793
 * Chain Name: Etherlink
 * Default Block Explorer: https://explorer.etherlink.com
 * Default RPC URL: https://node.mainnet.etherlink.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { etherlink } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: etherlink,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const etherlink = createCommon({
	...nativeDefineChain({
		id: 42793,
		name: 'Etherlink',
		nativeCurrency: { name: 'Tez', symbol: 'XTZ', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://node.mainnet.etherlink.com'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Etherlink',
				url: 'https://explorer.etherlink.com',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 33899,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
