// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the btrTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 200810
 * Chain Name: Bitlayer Testnet
 * Default Block Explorer: https://testnet.btrscan.com
 * Default RPC URL: https://testnet-rpc.bitlayer.org
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { btrTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: btrTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const btrTestnet = createCommon({
	...nativeDefineChain({
		id: 200810,
		name: 'Bitlayer Testnet',
		nativeCurrency: { name: 'Bitcoin', symbol: 'BTC', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://testnet-rpc.bitlayer.org'],
				webSocket: ['wss://testnet-ws.bitlayer.org', 'wss://testnet-ws.bitlayer-rpc.com'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Bitlayer(BTR) Scan',
				url: 'https://testnet.btrscan.com',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
