// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the filecoinCalibration chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 314159
 * Chain Name: Filecoin Calibration
 * Default Block Explorer: https://calibration.filscan.io
 * Default RPC URL: https://api.calibration.node.glif.io/rpc/v1
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { filecoinCalibration } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: filecoinCalibration,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const filecoinCalibration = createCommon({
	...nativeDefineChain({
		id: 314159,
		name: 'Filecoin Calibration',
		nativeCurrency: { name: 'testnet filecoin', symbol: 'tFIL', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://api.calibration.node.glif.io/rpc/v1'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Filscan',
				url: 'https://calibration.filscan.io',
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
