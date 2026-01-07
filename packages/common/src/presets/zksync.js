// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the zksync chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 324
 * Chain Name: ZKsync Era
 * Default Block Explorer: https://era.zksync.network/
 * Default RPC URL: https://mainnet.era.zksync.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { zksync } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: zksync,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const zksync = createCommon({
	...nativeDefineChain({
		id: 324,
		name: 'ZKsync Era',
		network: 'zksync-era',
		nativeCurrency: {
			decimals: 18,
			name: 'Ether',
			symbol: 'ETH',
		},
		rpcUrls: {
			default: {
				http: ['https://mainnet.era.zksync.io'],
				webSocket: ['wss://mainnet.era.zksync.io/ws'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Etherscan',
				url: 'https://era.zksync.network/',
				apiUrl: 'https://api-era.zksync.network/api',
			},
			native: {
				name: 'ZKsync Explorer',
				url: 'https://explorer.zksync.io/',
				apiUrl: 'https://block-explorer-api.mainnet.zksync.io/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xF9cda624FBC7e059355ce98a31693d299FACd963',
			},
			erc6492Verifier: {
				address: '0xfB688330379976DA81eB64Fe4BF50d7401763B9C',
				blockCreated: 45659388,
			},
		},
		blockTime: 1000,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
