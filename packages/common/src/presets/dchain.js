// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the dchain chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 2716446429837000
 * Chain Name: Dchain
 * Default Block Explorer: https://dchain-2716446429837000-1.sagaexplorer.io
 * Default RPC URL: https://dchain-2716446429837000-1.jsonrpc.sagarpc.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { dchain } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: dchain,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const dchain = createCommon({
	...nativeDefineChain({
		id: 2716446429837000,
		name: 'Dchain',
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://dchain-2716446429837000-1.jsonrpc.sagarpc.io'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Dchain Explorer',
				url: 'https://dchain-2716446429837000-1.sagaexplorer.io',
				apiUrl: 'https://api-dchain-2716446429837000-1.sagaexplorer.io/api',
			},
		},
		contracts: {
			gasPriceOracle: { address: '0x420000000000000000000000000000000000000F' },
			l1Block: { address: '0x4200000000000000000000000000000000000015' },
			l2CrossDomainMessenger: { address: '0x4200000000000000000000000000000000000007' },
			l2Erc721Bridge: { address: '0x4200000000000000000000000000000000000014' },
			l2StandardBridge: { address: '0x4200000000000000000000000000000000000010' },
			l2ToL1MessagePasser: { address: '0x4200000000000000000000000000000000000016' },
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
