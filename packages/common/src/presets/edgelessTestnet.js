// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the edgelessTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 202
 * Chain Name: Edgeless Testnet
 * Default Block Explorer: https://testnet.explorer.edgeless.network
 * Default RPC URL: https://edgeless-testnet.rpc.caldera.xyz/http
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { edgelessTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: edgelessTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const edgelessTestnet = createCommon({
	...nativeDefineChain({
		id: 202,
		name: 'Edgeless Testnet',
		nativeCurrency: { name: 'Edgeless Wrapped ETH', symbol: 'EwETH', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://edgeless-testnet.rpc.caldera.xyz/http'],
				webSocket: ['wss://edgeless-testnet.rpc.caldera.xyz/ws'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Edgeless Testnet Explorer',
				url: 'https://testnet.explorer.edgeless.network',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
