// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the base chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 8453
 * Chain Name: Base
 * Default Block Explorer: https://basescan.org
 * Default RPC URL: https://mainnet.base.org
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { base } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: base,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const base = createCommon({
	...nativeDefineChain({
		id: 8453,
		name: 'Base',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		blockTime: 2000,
		rpcUrls: {
			default: {
				http: ['https://mainnet.base.org'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Basescan',
				url: 'https://basescan.org',
				apiUrl: 'https://api.basescan.org/api',
			},
		},
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
				blockCreated: 5022,
			},
		},
		sourceId: 1,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
