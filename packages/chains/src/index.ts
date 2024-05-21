import { Common, type Hardfork, createCommon } from '@tevm/common'
import { defineChain } from 'viem'
import {
	type Chain as ViemChain,
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

export type { ViemChain }

export type TevmChainCommon<TChain extends ViemChain> = TChain & { common: Common }

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

export const createChainCommon = <TChain extends ViemChain>(
	viemChain: TChain,
	commonOptions: CommonOptions,
): TevmChainCommon<TChain> => {
	const common = createCommon({
		eips: commonOptions.eips,
		chainId: BigInt(viemChain.id),
		hardfork: commonOptions.hardfork,
		loggingLevel: 'warn',
	})
	return Object.assign({}, viemChain, {
		common,
	})
}

// TODO I haven't actually looked into which EIPs and hardforks should be nabled
// TODO we want to enable hardfork and eips based on block number in future

/**
 * The default chain if no fork url is passed
 */
export const tevmDevnet = createChainCommon(
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
