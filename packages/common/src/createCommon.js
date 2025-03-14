import { Common } from '@ethereumjs/common'
import { InvalidParamsError } from '@tevm/errors'
import { createLogger } from '@tevm/logger'
import { DEFAULT_GENESIS } from './DEFAULT_GENESIS.js'

/**
 * Common is the main representation of chain specific configuration for tevm clients.
 *
 * createCommon creates a typesafe ethereumjs Common object used by the EVM
 * to access chain and hardfork parameters and to provide
 * a unified and shared view on the network and hardfork state.
 * Tevm common extends the [viem chain](https://github.com/wevm/viem/blob/main/src/chains/index.ts) interface
 * @param {import('./CommonOptions.js').CommonOptions} options
 * @returns {import('./Common.js').Common}
 * @throws {InvalidParamsError} only if invalid params are passed
 * @example
 * ```typescript
 * import { createCommon } from 'tevm/common'
 *
 * const common = cre e ateCommon({
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
 * To use with ethereumjs use the vmConfig property
 * @example
 * ```typescript
 * import { VM } from '@ethereumjs/vm'
 * import { createMemoryClient } from 'tevm'
 *
 * const common = createCommon({ ... })
 *
 * const vm = new VM({
 *   common: common.vmConfig,
 * })
 * ```
 * @see [Tevm client docs](https://tevm.sh/learn/clients/)
 */
export const createCommon = ({
	customCrypto = {},
	loggingLevel = 'warn',
	hardfork = 'cancun',
	eips = [],
	params = {},
	hardforkTransitionConfig,
	genesis = DEFAULT_GENESIS,
	...chain
}) => {
	// TODO need to update on new options
	try {
		const logger = createLogger({ level: loggingLevel, name: '@tevm/common' })
		const vmConfig = new Common({
			hardfork,
			eips: [...eips],
			customCrypto,
			// @ts-expect-error TODO why doesn't this type fix? Either a bug in ethjs or a bug in tevm
			params,
			chain: {
				name: chain.name,
				chainId: chain.id,
				genesis,
				hardforks: [...(hardforkTransitionConfig ?? [])],
				bootstrapNodes: [],
				consensus: {
					type: 'pos',
					algorithm: 'casper',
				},
			},
		})
		if (vmConfig.isActivatedEIP(6800)) {
			logger.warn('verkle state is currently not supported in tevm')
		}
		logger.debug(vmConfig.eips(), 'Created common with eips enabled')
		return {
			...chain,
			vmConfig,
			copy: () => {
				const ethjsCommonCopy = vmConfig.copy()
				const newCommon = createCommon({ loggingLevel, hardfork, eips, ...chain })
				newCommon.vmConfig = ethjsCommonCopy
				return newCommon
			},
		}
	} catch (e) {
		const err = /** @type {Error} */ (e)
		throw new InvalidParamsError(err.message, { cause: err })
	}
}
