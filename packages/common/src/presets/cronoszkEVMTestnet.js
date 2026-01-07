// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the cronoszkEVMTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 282
 * Chain Name: Cronos zkEVM Testnet
 * Default Block Explorer: https://explorer.zkevm.cronos.org/testnet
 * Default RPC URL: https://testnet.zkevm.cronos.org
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { cronoszkEVMTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: cronoszkEVMTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const cronoszkEVMTestnet = createCommon({
	...nativeDefineChain({
		id: 282,
		name: 'Cronos zkEVM Testnet',
		nativeCurrency: { name: 'Cronos zkEVM Test Coin', symbol: 'zkTCRO', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://testnet.zkevm.cronos.org'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Cronos zkEVM Testnet Explorer',
				url: 'https://explorer.zkevm.cronos.org/testnet',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
