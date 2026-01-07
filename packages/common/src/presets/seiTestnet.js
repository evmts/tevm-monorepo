// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the seiTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1328
 * Chain Name: Sei Testnet
 * Default Block Explorer: https://seitrace.com
 * Default RPC URL: https://evm-rpc-testnet.sei-apis.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { seiTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: seiTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const seiTestnet = createCommon({
	...nativeDefineChain({
		id: 1328,
		name: 'Sei Testnet',
		nativeCurrency: {
			name: 'Sei',
			symbol: 'SEI',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://evm-rpc-testnet.sei-apis.com'],
				webSocket: ['wss://evm-ws-testnet.sei-apis.com'],
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
