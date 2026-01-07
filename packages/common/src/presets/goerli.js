// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the goerli chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 5
 * Chain Name: Goerli
 * Default Block Explorer: https://goerli.etherscan.io
 * Default RPC URL: https://rpc.ankr.com/eth_goerli
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { goerli } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: goerli,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const goerli = createCommon({
	...nativeDefineChain({
		id: 5,
		name: 'Goerli',
		nativeCurrency: {
			name: 'Goerli Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: ['https://rpc.ankr.com/eth_goerli'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Etherscan',
				url: 'https://goerli.etherscan.io',
				apiUrl: 'https://api-goerli.etherscan.io/api',
			},
		},
		contracts: {
			ensRegistry: {
				address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
			},
			ensUniversalResolver: {
				address: '0xfc4AC75C46C914aF5892d6d3eFFcebD7917293F1',
				blockCreated: 10339206,
			},
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 6507670,
			},
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
