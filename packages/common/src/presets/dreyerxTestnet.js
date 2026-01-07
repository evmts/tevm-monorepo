// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the dreyerxTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 23452
 * Chain Name: DreyerX Testnet
 * Default Block Explorer: https://testnet-scan.dreyerx.com
 * Default RPC URL: http://testnet-rpc.dreyerx.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { dreyerxTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: dreyerxTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const dreyerxTestnet = createCommon({
	...nativeDefineChain({
		id: 23452,
		name: 'DreyerX Testnet',
		nativeCurrency: { name: 'DreyerX', symbol: 'DRX', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['http://testnet-rpc.dreyerx.com'],
			},
		},
		blockExplorers: {
			default: {
				name: 'DreyerX Testnet Scan',
				url: 'https://testnet-scan.dreyerx.com',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
