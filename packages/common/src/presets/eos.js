// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the eos chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 17777
 * Chain Name: EOS EVM
 * Default Block Explorer: https://explorer.evm.eosnetwork.com
 * Default RPC URL: https://api.evm.eosnetwork.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { eos } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: eos,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const eos = createCommon({
	...nativeDefineChain({
		id: 17777,
		name: 'EOS EVM',
		nativeCurrency: { name: 'EOS', symbol: 'EOS', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://api.evm.eosnetwork.com'],
			},
		},
		blockExplorers: {
			default: {
				name: 'EOS EVM Explorer',
				url: 'https://explorer.evm.eosnetwork.com',
				apiUrl: 'https://explorer.evm.eosnetwork.com/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 7943933,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
