// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the celoAlfajores chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 44787
 * Chain Name: Alfajores
 * Default Block Explorer: https://celo-alfajores.blockscout.com
 * Default RPC URL: https://alfajores-forno.celo-testnet.org
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { celoAlfajores } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: celoAlfajores,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const celoAlfajores = createCommon({
	...nativeDefineChain({
		id: 44787,
		name: 'Alfajores',
		nativeCurrency: { name: 'CELO', symbol: 'A-CELO', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://alfajores-forno.celo-testnet.org'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Celo Alfajores Explorer',
				url: 'https://celo-alfajores.blockscout.com',
				apiUrl: 'https://celo-alfajores.blockscout.com/api',
			},
		},
		contracts: {
			gasPriceOracle: {
				address: '0x420000000000000000000000000000000000000F',
			},
			l1Block: {
				address: '0x4200000000000000000000000000000000000015',
			},
			l2CrossDomainMessenger: {
				address: '0x4200000000000000000000000000000000000007',
			},
			l2Erc721Bridge: {
				address: '0x4200000000000000000000000000000000000014',
			},
			l2StandardBridge: {
				address: '0x4200000000000000000000000000000000000010',
			},
			l2ToL1MessagePasser: {
				address: '0x4200000000000000000000000000000000000016',
			},
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 14569001,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
