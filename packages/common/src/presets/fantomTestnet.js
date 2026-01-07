// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the fantomTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 4002
 * Chain Name: Fantom Testnet
 * Default Block Explorer: https://testnet.ftmscan.com
 * Default RPC URL: https://rpc.testnet.fantom.network
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { fantomTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: fantomTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const fantomTestnet = createCommon({
	...nativeDefineChain({
		id: 4002,
		name: 'Fantom Testnet',
		nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://rpc.testnet.fantom.network'],
			},
		},
		blockExplorers: {
			default: {
				name: 'FTMScan',
				url: 'https://testnet.ftmscan.com',
				apiUrl: 'https://testnet.ftmscan.com/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 8328688,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
