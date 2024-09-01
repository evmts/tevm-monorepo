import { mantle as _mantle } from 'viem/chains'
import { createCommon } from '../createCommon.js'

export const mantle = createCommon({
	..._mantle,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
