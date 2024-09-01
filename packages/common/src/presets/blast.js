import { blast as _blast } from 'viem/chains'
import { createCommon } from '../createCommon.js'

export const blast = createCommon({
	..._blast,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
