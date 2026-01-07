// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the chips chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 2882
 * Chain Name: Chips Network
 * Default RPC URL: https://node.chips.ooo/wasp/api/v1/chains/iota1pp3d3mnap3ufmgqnjsnw344sqmf5svjh26y2khnmc89sv6788y3r207a8fn/evm
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { chips } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: chips,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const chips = createCommon({
	...nativeDefineChain({
		id: 2882,
		name: 'Chips Network',
		nativeCurrency: { name: 'IOTA', symbol: 'IOTA', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://node.chips.ooo/wasp/api/v1/chains/iota1pp3d3mnap3ufmgqnjsnw344sqmf5svjh26y2khnmc89sv6788y3r207a8fn/evm'],
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
