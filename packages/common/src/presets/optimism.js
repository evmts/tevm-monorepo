// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the optimism chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 10
 * Chain Name: OP Mainnet
 * Default Block Explorer: https://optimistic.etherscan.io
 * Default RPC URL: https://mainnet.optimism.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { optimism } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: optimism,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const optimism = createCommon({
	...nativeDefineChain({
		id: 10,
		name: 'OP Mainnet',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		blockTime: 2000,
		rpcUrls: {
			default: {
				http: ['https://mainnet.optimism.io'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Optimism Explorer',
				url: 'https://optimistic.etherscan.io',
				apiUrl: 'https://api-optimistic.etherscan.io/api',
			},
		},
		sourceId: 1,
		contracts: {
			gasPriceOracle: {
				address: '0x420000000000000000000000000000000000000F',
			},
			l1Block: {
				address: '0x4200000000000000000000000000000000000015',
			},
			l2CrossDomainMessenger: {
				address: '0x4200000000000000000000000000000000000007',
			},
			l2Erc721Bridge: {
				address: '0x4200000000000000000000000000000000000014',
			},
			l2StandardBridge: {
				address: '0x4200000000000000000000000000000000000010',
			},
			l2ToL1MessagePasser: {
				address: '0x4200000000000000000000000000000000000016',
			},
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 4286263,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
