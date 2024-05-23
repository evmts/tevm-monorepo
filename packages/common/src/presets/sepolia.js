import { defineChain } from 'viem'
import {
	base as _base,
	baseSepolia as _baseSepolia,
	mainnet as _mainnet,
	optimism as _optimism,
	optimismSepolia as _optimismSepolia,
	sepolia as _sepolia,
	zora as _zora,
	zoraSepolia as _zoraSepolia,
	foundry,
} from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * The default chain if no fork url is passed
 */
export const tevmDevnet = createCommon({
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
/**
* TODO update op-stack package to use this
export const tevmL2Devnet = createChainCommon(
defineChain({
id: 900,
name: 'tevm-devnet',
fees: _optimism.fees,
rpcUrls: foundry.rpcUrls,
testnet: true,
custom: foundry.custom,
})
)
*/

export const mainnet = createChainCommon(_mainnet, {
	eips: [],
	hardfork: 'cancun',
})

export const sepolia = createChainCommon(_sepolia, {
	eips: [],
	hardfork: 'cancun',
})

export const optimism = createChainCommon(_optimism, {
	eips: [],
	hardfork: 'cancun',
})

export const optimismSepolia = createChainCommon(_optimismSepolia, {
	eips: [],
	hardfork: 'cancun',
})

export const base = createChainCommon(_base, {
	eips: [],
	hardfork: 'cancun',
})

export const baseSepolia = createChainCommon(_baseSepolia, {
	eips: [],
	hardfork: 'cancun',
})

export const zora = createChainCommon(_zora, {
	eips: [],
	hardfork: 'cancun',
})

export const zoraSepolia = createChainCommon(_zoraSepolia, {
	eips: [],
	hardfork: 'cancun',
})
