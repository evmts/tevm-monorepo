import { zoraSepolia as _zoraSepolia } from 'viem/chains'
import { createCommon } from '../createCommon.js'

export const zoraSepolia = createCommon({
	..._zoraSepolia,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
