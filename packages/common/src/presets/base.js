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

export const base = createCommon({
	..._base,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
