// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the dreyerxMainnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 23451
 * Chain Name: DreyerX Mainnet
 * Default Block Explorer: https://scan.dreyerx.com
 * Default RPC URL: https://rpc.dreyerx.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { dreyerxMainnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: dreyerxMainnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const dreyerxMainnet = createCommon({
	...nativeDefineChain({
		id: 23451,
		name: 'DreyerX Mainnet',
		nativeCurrency: { name: 'DreyerX', symbol: 'DRX', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://rpc.dreyerx.com'],
			},
		},
		blockExplorers: {
			default: {
				name: 'DreyerX Scan',
				url: 'https://scan.dreyerx.com',
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
