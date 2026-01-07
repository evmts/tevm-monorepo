// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the filecoinHyperspace chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 3141
 * Chain Name: Filecoin Hyperspace
 * Default Block Explorer: https://hyperspace.filfox.info/en
 * Default RPC URL: https://api.hyperspace.node.glif.io/rpc/v1
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { filecoinHyperspace } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: filecoinHyperspace,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const filecoinHyperspace = createCommon({
	...nativeDefineChain({
		id: 3141,
		name: 'Filecoin Hyperspace',
		nativeCurrency: { name: 'testnet filecoin', symbol: 'tFIL', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://api.hyperspace.node.glif.io/rpc/v1'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Filfox',
				url: 'https://hyperspace.filfox.info/en',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
