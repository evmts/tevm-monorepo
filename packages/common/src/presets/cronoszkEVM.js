// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the cronoszkEVM chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 388
 * Chain Name: Cronos zkEVM Mainnet
 * Default Block Explorer: https://explorer.zkevm.cronos.org
 * Default RPC URL: https://mainnet.zkevm.cronos.org
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { cronoszkEVM } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: cronoszkEVM,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const cronoszkEVM = createCommon({
	...nativeDefineChain({
		id: 388,
		name: 'Cronos zkEVM Mainnet',
		nativeCurrency: { name: 'Cronos zkEVM CRO', symbol: 'zkCRO', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://mainnet.zkevm.cronos.org'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Cronos zkEVM (Mainnet) Chain Explorer',
				url: 'https://explorer.zkevm.cronos.org',
			},
		},
		contracts: {
			multicall3: {
				address: '0x06f4487d7c4a5983d2660db965cc6d2565e4cfaa',
				blockCreated: 72,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
