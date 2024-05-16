import { Common } from '@ethereumjs/common'
import { createLogger } from '@tevm/logger'

/**
 * Creates an ethereumjs Common object used by the EVM
 * to access chain and hardfork parameters and to provide
 * a unified and shared view on the network and hardfork state.
 * @param {import('./CommonOptions.js').CommonOptions} options
 * @returns {Common}
 */
export const createCommon = ({ loggingLevel, chainId, hardfork, eips = [] }) => {
	const logger = createLogger({ level: loggingLevel, name: '@tevm/common' })
	const common = Common.custom(
		{
			name: 'TevmCustom',
			chainId,
			// TODO what is diff between chainId and networkId???
			networkId: chainId,
		},
		{
			hardfork: hardfork ?? 'cancun',
			baseChain: 1,
			eips: [...(eips ?? []), 1559, 4895, 4844, 4788],
		},
	)
	if (common.isActivatedEIP(6800)) {
		logger.warn('verkle state is currently not supported in tevm')
	}
	logger.debug(common.eips(), 'Created common with eips enabled')
	return common
}
