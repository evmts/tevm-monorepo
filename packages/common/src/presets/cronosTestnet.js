// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the cronosTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 338
 * Chain Name: Cronos Testnet
 * Default Block Explorer: https://explorer.cronos.org/testnet
 * Default RPC URL: https://evm-t3.cronos.org
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { cronosTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: cronosTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const cronosTestnet = createCommon({
	...nativeDefineChain({
		id: 338,
		name: 'Cronos Testnet',
		nativeCurrency: { name: 'CRO', symbol: 'tCRO', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://evm-t3.cronos.org'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Cronos Explorer (Testnet)',
				url: 'https://explorer.cronos.org/testnet',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 10191251,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
