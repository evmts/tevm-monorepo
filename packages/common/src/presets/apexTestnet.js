// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the apexTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 3993
 * Chain Name: APEX Testnet
 * Default Block Explorer: https://exp-testnet.apexlayer.xyz
 * Default RPC URL: https://rpc-testnet.apexlayer.xyz
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { apexTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: apexTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const apexTestnet = createCommon({
	...nativeDefineChain({
		id: 3993,
		name: 'APEX Testnet',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://rpc-testnet.apexlayer.xyz'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Blockscout',
				url: 'https://exp-testnet.apexlayer.xyz',
			},
		},
		contracts: {
			multicall3: {
				address: '0xf7642be33a6b18D16a995657adb5a68CD0438aE2',
				blockCreated: 283775,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
