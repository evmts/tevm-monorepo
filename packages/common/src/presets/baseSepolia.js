import { baseSepolia as _baseSepolia } from 'viem/chains'
import { createCommon } from '../createCommon.js'

export const baseSepolia = createCommon({
	..._baseSepolia,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
