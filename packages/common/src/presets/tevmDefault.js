import { defineChain } from '@tevm/utils'
import { optimism as _optimism, foundry } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * The default chain if no fork url is passed
 */
export const tevmDefault = createCommon({
	...defineChain({
		id: 900,
		name: 'tevm-devnet',
		fees: _optimism.fees,
		rpcUrls: foundry.rpcUrls,
		testnet: true,
		custom: foundry.custom,
		contracts: {
			...foundry.contracts,
			// we add this in createTevmNode
			multicall3: { address: '0xcA11bde05977b3631167028862bE2a173976CA11', blockCreated: 0 },
		},
		formatters: _optimism.formatters,
		nativeCurrency: _optimism.nativeCurrency,
		blockExplorers: foundry.blockExplorers,
		serializers: _optimism.serializers,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
