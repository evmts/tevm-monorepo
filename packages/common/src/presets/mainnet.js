import { mainnet as _mainnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

export const mainnet = createCommon({
	..._mainnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
