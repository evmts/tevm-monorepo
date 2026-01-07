import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Native foundry RPC URLs - replaces viem/chains foundry.rpcUrls
 * @type {import('@tevm/utils').Chain['rpcUrls']}
 */
const foundryRpcUrls = {
	default: {
		http: ['http://127.0.0.1:8545'],
		webSocket: ['ws://127.0.0.1:8545'],
	},
	public: {
		http: ['http://127.0.0.1:8545'],
		webSocket: ['ws://127.0.0.1:8545'],
	},
}

/**
 * Native ETH native currency - replaces viem/chains optimism.nativeCurrency
 * @type {import('@tevm/utils').Chain['nativeCurrency']}
 */
const ethNativeCurrency = {
	decimals: 18,
	name: 'Ether',
	symbol: 'ETH',
}

/**
 * The default chain if no fork url is passed.
 *
 * This is a native implementation that doesn't depend on viem/chains.
 * Uses tevm-devnet (chain ID 900) with Optimism-compatible fees and foundry RPC URLs.
 */
export const tevmDefault = createCommon({
	...nativeDefineChain({
		id: 900,
		name: 'tevm-devnet',
		rpcUrls: foundryRpcUrls,
		testnet: true,
		contracts: {
			// we add this in createTevmNode
			multicall3: { address: '0xcA11bde05977b3631167028862bE2a173976CA11', blockCreated: 0 },
		},
		nativeCurrency: ethNativeCurrency,
		// Note: fees, formatters, and serializers from optimism are omitted
		// These are optional and not required for basic chain operation
		// If needed, they can be added back as native implementations
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
