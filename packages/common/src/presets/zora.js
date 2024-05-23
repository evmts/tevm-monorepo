import { zora as _zora } from 'viem/chains'
import { createCommon } from '../createCommon.js'

export const zora = createCommon({
	..._zora,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
