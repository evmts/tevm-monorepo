import { arbitrum as _arbitrum } from 'viem/chains'
import { createCommon } from '../createCommon.js'

export const arbitrum = createCommon({
	..._arbitrum,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
