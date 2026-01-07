// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the holesky chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 17000
 * Chain Name: Holesky
 * Default Block Explorer: https://holesky.etherscan.io
 * Default RPC URL: https://ethereum-holesky-rpc.publicnode.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { holesky } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: holesky,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const holesky = createCommon({
	...nativeDefineChain({
		id: 17000,
		name: 'Holesky',
		nativeCurrency: {
			name: 'Holesky Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://ethereum-holesky-rpc.publicnode.com'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Etherscan',
				url: 'https://holesky.etherscan.io',
				apiUrl: 'https://api-holesky.etherscan.io/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 77,
			},
			ensRegistry: {
				address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
				blockCreated: 801613,
			},
			ensUniversalResolver: {
				address: '0xa6AC935D4971E3CD133b950aE053bECD16fE7f3b',
				blockCreated: 973484,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
