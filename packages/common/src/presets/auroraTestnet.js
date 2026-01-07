// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the auroraTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1313161555
 * Chain Name: Aurora Testnet
 * Default Block Explorer: https://testnet.aurorascan.dev
 * Default RPC URL: https://testnet.aurora.dev
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { auroraTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: auroraTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const auroraTestnet = createCommon({
	...nativeDefineChain({
		id: 1313161555,
		name: 'Aurora Testnet',
		nativeCurrency: {
			decimals: 18,
			name: 'Ether',
			symbol: 'ETH',
		},
		rpcUrls: {
			default: { http: ['https://testnet.aurora.dev'] },
		},
		blockExplorers: {
			default: { name: 'Aurorascan', url: 'https://testnet.aurorascan.dev' },
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
