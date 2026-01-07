// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the bronos chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1039
 * Chain Name: Bronos
 * Default Block Explorer: https://broscan.bronos.org
 * Default RPC URL: https://evm.bronos.org
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { bronos } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: bronos,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const bronos = createCommon({
	...nativeDefineChain({
		id: 1039,
		name: 'Bronos',
		nativeCurrency: { name: 'BRO', symbol: 'BRO', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://evm.bronos.org'],
			},
		},
		blockExplorers: {
			default: {
				name: 'BronoScan',
				url: 'https://broscan.bronos.org',
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
