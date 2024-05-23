import { sepolia as _sepolia } from 'viem/chains'
import { createCommon } from '../createCommon.js'

export const sepolia = createCommon({
	..._sepolia,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
