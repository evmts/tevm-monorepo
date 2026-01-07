// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the eosTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 15557
 * Chain Name: EOS EVM Testnet
 * Default Block Explorer: https://explorer.testnet.evm.eosnetwork.com
 * Default RPC URL: https://api.testnet.evm.eosnetwork.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { eosTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: eosTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const eosTestnet = createCommon({
	...nativeDefineChain({
		id: 15557,
		name: 'EOS EVM Testnet',
		nativeCurrency: { name: 'EOS', symbol: 'EOS', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://api.testnet.evm.eosnetwork.com'],
			},
		},
		blockExplorers: {
			default: {
				name: 'EOS EVM Testnet Explorer',
				url: 'https://explorer.testnet.evm.eosnetwork.com',
				apiUrl: 'https://explorer.testnet.evm.eosnetwork.com/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 9067940,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
