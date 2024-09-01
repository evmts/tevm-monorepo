import { redstone as _redstone } from 'viem/chains'
import { createCommon } from '../createCommon.js'

export const redstone = createCommon({
	..._redstone,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
