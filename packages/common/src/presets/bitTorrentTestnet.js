// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the bitTorrentTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1028
 * Chain Name: BitTorrent Chain Testnet
 * Default Block Explorer: https://testnet.bttcscan.com
 * Default RPC URL: https://testrpc.bittorrentchain.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { bitTorrentTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: bitTorrentTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const bitTorrentTestnet = createCommon({
	...nativeDefineChain({
		id: 1028,
		name: 'BitTorrent Chain Testnet',
		nativeCurrency: { name: 'BitTorrent', symbol: 'BTT', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://testrpc.bittorrentchain.io'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Bttcscan',
				url: 'https://testnet.bttcscan.com',
				apiUrl: 'https://testnet.bttcscan.com/api',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
