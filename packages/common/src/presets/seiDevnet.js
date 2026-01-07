// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the seiDevnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 713715
 * Chain Name: Sei Devnet
 * Default Block Explorer: https://seitrace.com
 * Default RPC URL: https://evm-rpc-arctic-1.sei-apis.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { seiDevnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: seiDevnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const seiDevnet = createCommon({
	...nativeDefineChain({
		id: 713715,
		name: 'Sei Devnet',
		nativeCurrency: {
			name: 'Sei',
			symbol: 'SEI',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://evm-rpc-arctic-1.sei-apis.com'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Seitrace',
				url: 'https://seitrace.com',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
