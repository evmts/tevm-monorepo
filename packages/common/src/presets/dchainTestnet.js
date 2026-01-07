// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the dchainTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 2713017997578000
 * Chain Name: Dchain Testnet
 * Default Block Explorer: https://dchaintestnet-2713017997578000-1.testnet.sagaexplorer.io
 * Default RPC URL: https://dchaintestnet-2713017997578000-1.jsonrpc.testnet.sagarpc.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { dchainTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: dchainTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const dchainTestnet = createCommon({
	...nativeDefineChain({
		id: 2713017997578000,
		name: 'Dchain Testnet',
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://dchaintestnet-2713017997578000-1.jsonrpc.testnet.sagarpc.io'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Dchain Explorer',
				url: 'https://dchaintestnet-2713017997578000-1.testnet.sagaexplorer.io',
				apiUrl: 'https://api-dchaintestnet-2713017997578000-1.testnet.sagaexplorer.io/api',
			},
		},
		contracts: {
			gasPriceOracle: { address: '0x420000000000000000000000000000000000000F' },
			l1Block: { address: '0x4200000000000000000000000000000000000015' },
			l2CrossDomainMessenger: { address: '0x4200000000000000000000000000000000000007' },
			l2Erc721Bridge: { address: '0x4200000000000000000000000000000000000014' },
			l2StandardBridge: { address: '0x4200000000000000000000000000000000000010' },
			l2ToL1MessagePasser: { address: '0x4200000000000000000000000000000000000016' },
		},
		testnet: true,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
