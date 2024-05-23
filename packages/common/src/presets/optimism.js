import { optimism as _optimism } from 'viem/chains'
import { createCommon } from '../createCommon.js'

export const optimism = createCommon({
	..._optimism,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
