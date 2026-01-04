import { createCustomCommon, Mainnet } from '@ethereumjs/common'
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
	hardfork = 'prague',
	eips = [],
	...chain
}) => {
	try {
		const logger = createLogger({ level: loggingLevel, name: '@tevm/common' })

		// Ensure eips is an array
		const eipsArray = Array.isArray(eips) ? eips : []

		// Create Common instance using createCustomCommon
		const finalCustomCrypto =
			customCrypto && Object.keys(customCrypto).length > 0
				? { kzg: createMockKzg(), ...customCrypto }
				: { kzg: createMockKzg() }

		const ethjsCommon = createCustomCommon(
			{
				chainId: chain.id,
				name: chain.name || 'TevmCustom',
			},
			Mainnet,
			{
				hardfork,
				eips: [...eipsArray, 1, 1559, 3529, 4895, 4844, 4788, 2935],
				customCrypto: finalCustomCrypto,
				params: {
					// EIP-1 (chainstart) - base gas parameters
					1: {
						maxRefundQuotient: 2, // Default value, overridden by EIP-3529
					},
					1559: {
						elasticityMultiplier: 2,
						baseFeeMaxChangeDenominator: 8,
						initialBaseFee: 1000000000,
					},
					// EIP-3529 (London) - changed maxRefundQuotient from 2 to 5
					3529: {
						maxRefundQuotient: 5,
					},
					4844: {
						targetBlobGasPerBlock: 393216,
						blobGasPerBlob: 131072,
						minBlobGasPrice: 1,
						blobGasPriceUpdateFraction: 3338477,
					},
					4788: {
						historicalRootsLength: 8191,
					},
					// VM params accessed via param('vm', ...)
					vm: {
						historicalRootsLength: 8191,
						historyStorageAddress: '0x0aae40965e6800cd9b1f4b05ff21581047e3f91e',
						historyServeWindow: 8192,
					},
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
	} catch (e) {
		const err = /** @type {Error} */ (e)
		throw new InvalidParamsError(err.message, { cause: err })
	}
}
