import { Common, type Hardfork, createCommon } from '@tevm/common'
import { defineChain } from 'viem'
import {
	type Chain,
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

export type TevmChain = Chain & Common

export type CommonOptions = {
	/**
	 * EIPs enabled. Note some EIPS are always enabled by default such as EIP-1559
	 */
	eips: ReadonlyArray<number>
	/**
	 * The ethereum hardfork running on the chain
	 * In future we will take hardfork by blockNumber so the hardfork eips can change based on the block height.
	 */
	hardfork: Hardfork
}

export const createChain = (viemChain: Chain, commonOptions: CommonOptions): TevmChain => {
	const common = createCommon({
		eips: commonOptions.eips,
		chainId: BigInt(viemChain.id),
		hardfork: commonOptions.hardfork,
		loggingLevel: 'warn',
	})
	return Object.assign(common, viemChain)
}

// TODO I haven't actually looked into which EIPs and hardforks should be nabled
// TODO we want to enable hardfork and eips based on block number in future

/**
 * The default chain if no fork url is passed
 */
export const tevmDevnet = createChain(
	defineChain({
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
	{
		eips: [],
		hardfork: 'cancun',
	},
)
/**
* TODO update op-stack package to use this
export const tevmL2Devnet = createChain(
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

export const mainnet = createChain(_mainnet, {
	eips: [],
	hardfork: 'cancun',
})

export const sepolia = createChain(_sepolia, {
	eips: [],
	hardfork: 'cancun',
})

export const optimism = createChain(_optimism, {
	eips: [],
	hardfork: 'cancun',
})

export const optimismSepolia = createChain(_optimismSepolia, {
	eips: [],
	hardfork: 'cancun',
})

export const base = createChain(_base, {
	eips: [],
	hardfork: 'cancun',
})

export const baseSepolia = createChain(_baseSepolia, {
	eips: [],
	hardfork: 'cancun',
})

export const zora = createChain(_zora, {
	eips: [],
	hardfork: 'cancun',
})

export const zoraSepolia = createChain(_zoraSepolia, {
	eips: [],
	hardfork: 'cancun',
})
