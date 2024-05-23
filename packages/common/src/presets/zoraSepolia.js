import {
	base as _base,
	baseSepolia as _baseSepolia,
	mainnet as _mainnet,
	optimism as _optimism,
	optimismSepolia as _optimismSepolia,
	sepolia as _sepolia,
	zora as _zora,
	zoraSepolia as _zoraSepolia,
} from 'viem/chains'
import { createCommon } from '../createCommon.js'

export const zoraSepolia = createCommon({
	..._zoraSepolia,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
