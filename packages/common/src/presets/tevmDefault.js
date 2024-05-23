import { defineChain } from 'viem'
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
		contracts: foundry.contracts,
		formatters: _optimism.formatters,
		nativeCurrency: _optimism.nativeCurrency,
		blockExplorers: foundry.blockExplorers,
		serializers: _optimism.serializers,
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
