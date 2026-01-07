// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the wanchain chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 888
 * Chain Name: Wanchain
 * Default Block Explorer: https://wanscan.org
 * Default RPC URL: https://gwan-ssl.wandevs.org:56891
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { wanchain } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: wanchain,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const wanchain = createCommon({
	...nativeDefineChain({
		id: 888,
		name: 'Wanchain',
		nativeCurrency: { name: 'WANCHAIN', symbol: 'WAN', decimals: 18 },
		rpcUrls: {
			default: {
				http: [
					'https://gwan-ssl.wandevs.org:56891',
					'https://gwan2-ssl.wandevs.org',
				],
			},
		},
		blockExplorers: {
			default: {
				name: 'WanScan',
				url: 'https://wanscan.org',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcDF6A1566e78EB4594c86Fe73Fcdc82429e97fbB',
				blockCreated: 25312390,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
