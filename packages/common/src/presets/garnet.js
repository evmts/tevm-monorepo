import { garnet as _garnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

export const redstone = createCommon({
	..._garnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
