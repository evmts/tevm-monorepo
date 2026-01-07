// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the confluxESpace chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1030
 * Chain Name: Conflux eSpace
 * Default Block Explorer: https://evm.confluxscan.org
 * Default RPC URL: https://evm.confluxrpc.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { confluxESpace } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: confluxESpace,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const confluxESpace = createCommon({
	...nativeDefineChain({
		id: 1030,
		name: 'Conflux eSpace',
		nativeCurrency: { name: 'Conflux', symbol: 'CFX', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://evm.confluxrpc.com'],
				webSocket: ['wss://evm.confluxrpc.com/ws'],
			},
		},
		blockExplorers: {
			default: {
				name: 'ConfluxScan',
				url: 'https://evm.confluxscan.org',
			},
		},
		contracts: {
			multicall3: {
				address: '0xEFf0078910f638cd81996cc117bccD3eDf2B072F',
				blockCreated: 68602935,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
