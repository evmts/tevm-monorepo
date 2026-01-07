// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the etherlinkTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 128123
 * Chain Name: Etherlink Testnet
 * Default Block Explorer: https://testnet-explorer.etherlink.com
 * Default RPC URL: https://node.ghostnet.etherlink.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { etherlinkTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: etherlinkTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const etherlinkTestnet = createCommon({
	...nativeDefineChain({
		id: 128123,
		name: 'Etherlink Testnet',
		nativeCurrency: { name: 'Tez', symbol: 'XTZ', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://node.ghostnet.etherlink.com'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Etherlink Testnet',
				url: 'https://testnet.explorer.etherlink.com',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
