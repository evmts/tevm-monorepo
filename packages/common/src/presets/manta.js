import { manta as _manta } from 'viem/chains'
import { createCommon } from '../createCommon.js'

export const manta = createCommon({
	..._manta,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
