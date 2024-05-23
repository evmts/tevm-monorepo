import { Common } from '@ethereumjs/common'
import { createLogger } from '@tevm/logger'
import { createMockKzg } from './createMockKzg.js'

/**
 * Creates an ethereumjs Common object used by the EVM
 * to access chain and hardfork parameters and to provide
 * a unified and shared view on the network and hardfork state.
 * @param {import('./CommonOptions.js').CommonOptions} options
 * @returns {import('./Common.js').Common}
 */
export const createCommon = ({ customCrypto = {}, loggingLevel, hardfork, eips = [], ...chain }) => {
	const logger = createLogger({ level: loggingLevel, name: '@tevm/common' })
	const ethjsCommon = Common.custom(
		{
			name: 'TevmCustom',
			chainId: chain.id,
			// TODO what is diff between chainId and networkId???
			networkId: chain.id,
		},
		{
			hardfork: hardfork ?? 'cancun',
			baseChain: 1,
			eips: [...(eips ?? []), 1559, 4895, 4844, 4788],
			customCrypto: {
				kzg: createMockKzg(),
				...customCrypto,
			},
		},
	)
	if (ethjsCommon.isActivatedEIP(6800)) {
		logger.warn('verkle state is currently not supported in tevm')
	}
	logger.debug(ethjsCommon.eips(), 'Created common with eips enabled')
	return {
		...chain,
		ethjsCommon,
		copy: () => {
			const ethjsCommonCopy = ethjsCommon.copy()
			const newCommon = createCommon({ loggingLevel, hardfork, eips, ...chain })
			newCommon.ethjsCommon = ethjsCommonCopy
			return newCommon
		},
	}
}
