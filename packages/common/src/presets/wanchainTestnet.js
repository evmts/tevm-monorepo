// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the wanchainTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 999
 * Chain Name: Wanchain Testnet
 * Default Block Explorer: https://wanscan.org
 * Default RPC URL: https://gwan-ssl.wandevs.org:46891
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { wanchainTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: wanchainTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const wanchainTestnet = createCommon({
	...nativeDefineChain({
		id: 999,
		name: 'Wanchain Testnet',
		nativeCurrency: { name: 'WANCHAIN', symbol: 'WANt', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://gwan-ssl.wandevs.org:46891'],
			},
		},
		blockExplorers: {
			default: {
				name: 'WanScanTest',
				url: 'https://wanscan.org',
			},
		},
		contracts: {
			multicall3: {
				address: '0x11c89bF4496c39FB80535Ffb4c92715839CC5324',
				blockCreated: 24743448,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
