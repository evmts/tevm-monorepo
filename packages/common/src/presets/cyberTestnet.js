// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the cyberTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 111557560
 * Chain Name: Cyber Testnet
 * Default Block Explorer: https://testnet.cyberscan.co
 * Default RPC URL: https://cyber-testnet.alt.technology
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { cyberTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: cyberTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const cyberTestnet = createCommon({
	...nativeDefineChain({
		id: 111557560,
		name: 'Cyber Testnet',
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://cyber-testnet.alt.technology'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Blockscout',
				url: 'https://testnet.cyberscan.co',
				apiUrl: 'https://testnet.cyberscan.co/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xffc391F0018269d4758AEA1a144772E8FB99545E',
				blockCreated: 304545,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
