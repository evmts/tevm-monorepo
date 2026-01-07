// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the canto chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 7700
 * Chain Name: Canto
 * Default Block Explorer: https://tuber.build
 * Default RPC URL: https://canto.gravitychain.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { canto } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: canto,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const canto = createCommon({
	...nativeDefineChain({
		id: 7700,
		name: 'Canto',
		nativeCurrency: { name: 'Canto', symbol: 'CANTO', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://canto.gravitychain.io'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Tuber.Build (Blockscout)',
				url: 'https://tuber.build',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 2905789,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
