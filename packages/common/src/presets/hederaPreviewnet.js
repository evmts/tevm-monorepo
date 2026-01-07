// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the hederaPreviewnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 297
 * Chain Name: Hedera Previewnet
 * Default Block Explorer: https://hashscan.io/previewnet
 * Default RPC URL: https://previewnet.hashio.io/api
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { hederaPreviewnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: hederaPreviewnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const hederaPreviewnet = createCommon({
	...nativeDefineChain({
		id: 297,
		name: 'Hedera Previewnet',
		nativeCurrency: {
			name: 'HBAR',
			symbol: 'HBAR',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://previewnet.hashio.io/api'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Hashscan',
				url: 'https://hashscan.io/previewnet',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
