import { base as _base } from 'viem/chains'
import { createCommon } from '../createCommon.js'

export const base = createCommon({
	..._base,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
