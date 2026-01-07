// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the berachainTestnetbArtio chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 80084
 * Chain Name: Berachain bArtio
 * Default Block Explorer: https://bartio.beratrail.io
 * Default RPC URL: https://bartio.rpc.berachain.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { berachainTestnetbArtio } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: berachainTestnetbArtio,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const berachainTestnetbArtio = createCommon({
	...nativeDefineChain({
		id: 80084,
		name: 'Berachain bArtio',
		nativeCurrency: { name: 'BERA Token', symbol: 'BERA', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://bartio.rpc.berachain.com'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Berachain bArtio Beratrail',
				url: 'https://bartio.beratrail.io',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 109269,
			},
			ensRegistry: {
				address: '0xB0eef18971290b333450586D33dcA6cE122651D2',
				blockCreated: 7736794,
			},
			ensUniversalResolver: {
				address: '0x41692Ef1EA0C79E6b73077E4A67572D2BDbD7057',
				blockCreated: 7736795,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
