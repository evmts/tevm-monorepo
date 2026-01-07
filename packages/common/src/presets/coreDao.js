// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the coreDao chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1116
 * Chain Name: Core Dao
 * Default Block Explorer: https://scan.coredao.org
 * Default RPC URL: https://rpc.coredao.org
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { coreDao } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: coreDao,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const coreDao = createCommon({
	...nativeDefineChain({
		id: 1116,
		name: 'Core Dao',
		nativeCurrency: { name: 'Core', symbol: 'CORE', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://rpc.coredao.org'],
			},
		},
		blockExplorers: {
			default: {
				name: 'CoreDao',
				url: 'https://scan.coredao.org',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 11907934,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
