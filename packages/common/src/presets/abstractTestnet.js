// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the abstractTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 11124
 * Chain Name: Abstract Testnet
 * Default Block Explorer: https://explorer.testnet.abs.xyz
 * Default RPC URL: https://api.testnet.abs.xyz
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { abstractTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: abstractTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const abstractTestnet = createCommon({
	...nativeDefineChain({
		id: 11124,
		name: 'Abstract Testnet',
		nativeCurrency: {
			name: 'ETH',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://api.testnet.abs.xyz'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Etherscan',
				url: 'https://sepolia.abscan.org',
			},
		},
		contracts: {
			multicall3: {
				address: '0xF9cda624FBC7e059355ce98a31693d299FACd963',
				blockCreated: 358349,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
