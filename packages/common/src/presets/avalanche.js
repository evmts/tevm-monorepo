import { avalanche as _avalanche } from 'viem/chains'
import { createCommon } from '../createCommon.js'

export const avalanche = createCommon({
	..._avalanche,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
