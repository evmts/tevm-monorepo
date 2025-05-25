import { Common, Mainnet } from '@ethereumjs/common'
import { InvalidParamsError } from '@tevm/errors'
import { createLogger } from '@tevm/logger'
import { createMockKzg } from './createMockKzg.js'

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
 * @see [Tevm client docs](https://tevm.sh/learn/clients/)
 */
export const createCommon = ({
	customCrypto = {},
	loggingLevel = 'warn',
	hardfork = 'cancun',
	eips = [],
	...chain
}) => {
	try {
		const logger = createLogger({ level: loggingLevel, name: '@tevm/common' })
		// Create a custom chain config based on Mainnet
		const customChainConfig = {
			...Mainnet,
			chainId: chain.id,
			networkId: chain.id,
			name: chain.name || 'TevmCustom',
		}
		// Create Common instance with the custom chain config
		const ethjsCommon = new Common({
			chain: customChainConfig,
			hardfork,
			eips: [...eips, 1559, 4895, 4844, 4788],
			customCrypto: {
				kzg: createMockKzg(),
				...customCrypto,
			},
		})
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
	} catch (e) {
		const err = /** @type {Error} */ (e)
		throw new InvalidParamsError(err.message, { cause: err })
	}
}
