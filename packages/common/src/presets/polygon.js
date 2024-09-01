import { polygon as _polygon } from 'viem/chains'
import { createCommon } from '../createCommon.js'

export const polygon = createCommon({
	..._polygon,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
