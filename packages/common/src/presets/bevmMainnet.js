// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the bevmMainnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 11501
 * Chain Name: BEVM Mainnet
 * Default Block Explorer: https://scan-mainnet.bevm.io
 * Default RPC URL: https://rpc-mainnet-1.bevm.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { bevmMainnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: bevmMainnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const bevmMainnet = createCommon({
	...nativeDefineChain({
		id: 11501,
		name: 'BEVM Mainnet',
		nativeCurrency: { name: 'Bitcoin', symbol: 'BTC', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://rpc-mainnet-1.bevm.io'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Bevmscan',
				url: 'https://scan-mainnet.bevm.io',
				apiUrl: 'https://scan-mainnet-api.bevm.io/api',
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
