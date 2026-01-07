// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the bob chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 60808
 * Chain Name: BOB
 * Default Block Explorer: https://explorer.gobob.xyz
 * Default RPC URL: https://rpc.gobob.xyz
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { bob } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: bob,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const bob = createCommon({
	...nativeDefineChain({
		id: 60808,
		name: 'BOB',
		nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://rpc.gobob.xyz'],
				webSocket: ['wss://rpc.gobob.xyz'],
			},
		},
		blockExplorers: {
			default: {
				name: 'BOB Explorer',
				url: 'https://explorer.gobob.xyz',
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
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 23131,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
