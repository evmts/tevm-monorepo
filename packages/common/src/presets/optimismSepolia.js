import { optimismSepolia as _optimismSepolia } from 'viem/chains'
import { createCommon } from '../createCommon.js'
export const optimismSepolia = createCommon({
	..._optimismSepolia,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
