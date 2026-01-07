// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the confluxESpaceTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 71
 * Chain Name: Conflux eSpace Testnet
 * Default Block Explorer: https://evmtestnet.confluxscan.org
 * Default RPC URL: https://evmtestnet.confluxrpc.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { confluxESpaceTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: confluxESpaceTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const confluxESpaceTestnet = createCommon({
	...nativeDefineChain({
		id: 71,
		name: 'Conflux eSpace Testnet',
		nativeCurrency: { name: 'Conflux', symbol: 'CFX', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://evmtestnet.confluxrpc.com'],
				webSocket: ['wss://evmtestnet.confluxrpc.com/ws'],
			},
		},
		blockExplorers: {
			default: {
				name: 'ConfluxScan',
				url: 'https://evmtestnet.confluxscan.org',
			},
		},
		contracts: {
			multicall3: {
				address: '0xEFf0078910f638cd81996cc117bccD3eDf2B072F',
				blockCreated: 117499050,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
