// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the dodochainTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 53457
 * Chain Name: DODOchain Testnet
 * Default Block Explorer: https://testnet-scan.dodochain.com
 * Default RPC URL: https://dodochain-testnet.alt.technology
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { dodochainTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: dodochainTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const dodochainTestnet = createCommon({
	...nativeDefineChain({
		id: 53457,
		name: 'DODOchain Testnet',
		nativeCurrency: { name: 'DODO', symbol: 'DODO', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://dodochain-testnet.alt.technology'],
				webSocket: ['wss://dodochain-testnet.alt.technology/ws'],
			},
		},
		blockExplorers: {
			default: {
				name: 'DODOchain Testnet (Sepolia) Explorer',
				url: 'https://testnet-scan.dodochain.com',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
