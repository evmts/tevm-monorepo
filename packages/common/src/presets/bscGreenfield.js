// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the bscGreenfield chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1017
 * Chain Name: BNB Greenfield Chain
 * Default Block Explorer: https://greenfieldscan.com
 * Default RPC URL: https://greenfield-chain.bnbchain.org
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { bscGreenfield } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: bscGreenfield,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const bscGreenfield = createCommon({
	...nativeDefineChain({
		id: 1017,
		name: 'BNB Greenfield Chain',
		nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://greenfield-chain.bnbchain.org'],
			},
		},
		blockExplorers: {
			default: {
				name: 'BNB Greenfield Mainnet Scan',
				url: 'https://greenfieldscan.com',
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
