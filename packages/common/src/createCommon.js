import { Common } from '@ethereumjs/common'
import { createLogger } from '@tevm/logger'
import { createMockKzg } from './createMockKzg.js'

/**
 * Creates a typesafe ethereumjs Common object used by the EVM
 * to access chain and hardfork parameters and to provide
 * a unified and shared view on the network and hardfork state.
 * Tevm common extends the [viem chain](https://github.com/wevm/viem/blob/main/src/chains/index.ts) interface
 * @param {import('./CommonOptions.js').CommonOptions} options
 * @returns {import('./Common.js').Common}
 * @example
 * ```js
 * import { createCommon } from 'tevm/common'
 *
 * const common = createCommon({
 *  customCrypto: {},
 *  loggingLevel: 'debug',
 *  hardfork: 'london',
 *  eips: [420],
 *  id: 69,
 *  name: 'MyChain',
 *  ...
 * })
 * ```
 * Since common are stateful consider copying it before using it
 * @example
 * ```typescript
 * import { createCommon } from 'tevm/common'
 * const common = createCommon({ ... })
 *
 * const commonCopy = common.copy()
 * ```
 *
 * To use with ethereumjs use the ethjsCommon property
 * @example
 * ```typescript
 * import { VM } from '@ethereumjs/vm'
 * import { createMemoryClient } from 'tevm'
 *
 * const common = createCommon({ ... })
 *
 * const vm = new VM({
 *   common: common.ethjsCommon,
 * })
 * ```
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
