import { scroll as _scroll } from 'viem/chains'
import { createCommon } from '../createCommon.js'

export const scroll = createCommon({
	..._scroll,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
