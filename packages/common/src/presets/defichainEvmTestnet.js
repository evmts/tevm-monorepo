// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the defichainEvmTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1131
 * Chain Name: DeFiChain EVM Testnet
 * Default Block Explorer: https://meta.defiscan.live/?network=TestNet
 * Default RPC URL: https://eth.testnet.ocean.jellyfishsdk.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { defichainEvmTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: defichainEvmTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const defichainEvmTestnet = createCommon({
	...nativeDefineChain({
		id: 1131,
		name: 'DeFiChain EVM Testnet',
		nativeCurrency: { name: 'DeFiChain', symbol: 'DFI', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://eth.testnet.ocean.jellyfishsdk.com'],
			},
		},
		blockExplorers: {
			default: {
				name: 'DeFiScan',
				url: 'https://meta.defiscan.live/?network=TestNet',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 156462,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
