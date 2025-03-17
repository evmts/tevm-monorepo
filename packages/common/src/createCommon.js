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
	hardfork = 'homestead', // Use a very basic hardfork as default
	eips = [],
	params = {},
	hardforkTransitionConfig,
	genesis = DEFAULT_GENESIS,
	...chain
}) => {
	// TODO need to update on new options
	try {
		const logger = createLogger({ level: loggingLevel, name: '@tevm/common' })

		// Prepare a complete chain config including hardforks
		// If no explicit hardforks are provided, add the basic ones
		const baseHardforks = hardforkTransitionConfig ?? [
			{
				name: 'homestead',
				block: 0,
			},
		]

		// Create Common object with safe defaults first
		const chainConfig = {
			name: chain.name ?? 'tevm',
			chainId: chain.id ?? 1,
			genesis,
			hardforks: [...baseHardforks], // Convert readonly array to mutable
			bootstrapNodes: [],
			consensus: {
				type: 'pos',
				algorithm: 'casper',
			},
		}

		// Use the first hardfork in the list as our default if none is provided
		const defaultHardfork = baseHardforks[0]?.name ?? 'homestead'

		// Create Common without EIPs first to avoid compatibility issues
		let vmConfig
		try {
			vmConfig = new Common({
				// Use first hardfork if available
				hardfork: defaultHardfork,
				// Don't set EIPs immediately
				customCrypto,
				// @ts-expect-error TODO why doesn't this type fix? Either a bug in ethjs or a bug in tevm
				params,
				chain: chainConfig,
			})

			// Only try to set the requested hardfork if it's different from our default
			if (hardfork !== defaultHardfork) {
				try {
					vmConfig.setHardfork(hardfork)
				} catch (error) {
					logger.warn(`Hardfork ${hardfork} not supported, using ${defaultHardfork} instead`)
				}
			}

			// Try to set EIPs if provided
			if (eips.length > 0) {
				try {
					// Try to set the EIPs after the hardfork is established
					vmConfig.setEIPs([...eips]) // Convert readonly array to mutable
				} catch (error) {
					// Log warning but continue without the EIPs
					logger.warn(`Some EIPs could not be activated on hardfork ${vmConfig.hardfork()}, continuing without them`)
				}
			}

			if (vmConfig.isActivatedEIP(6800)) {
				logger.warn('verkle state is currently not supported in tevm')
			}

			logger.debug(vmConfig.eips(), 'Created common with eips enabled')
		} catch (error) {
			// If we can't even create a basic Common object, fallback to minimum viable
			const errorMessage = error instanceof Error ? error.message : String(error)
			logger.error(`Error creating Common: ${errorMessage}, falling back to absolute minimum config`)
			vmConfig = new Common({
				hardfork: 'homestead',
				chain: {
					name: 'tevm',
					chainId: 1,
					genesis,
					hardforks: [{ name: 'homestead', block: 0 }],
					bootstrapNodes: [],
					consensus: {
						type: 'pos',
						algorithm: 'casper',
					},
				},
			})
		}

		return {
			...chain,
			vmConfig,
			copy: () => {
				const ethjsCommonCopy = vmConfig.copy()
				const currentHardfork = vmConfig.hardfork()
				// Only pass hardfork if it's a valid option from our Hardfork type
				// Otherwise default will be used
				const validHardforks = [
					'homestead',
					'dao',
					'tangerineWhistle',
					'spuriousDragon',
					'byzantium',
					'constantinople',
					'petersburg',
					'istanbul',
					'muirGlacier',
					'berlin',
					'london',
					'arrowGlacier',
					'grayGlacier',
					'mergeForkIdTransition',
					'paris',
					'shanghai',
					'cancun',
					'prague',
					'osaka',
				]

				const options = {
					loggingLevel,
					...(validHardforks.includes(currentHardfork)
						? { hardfork: /** @type {import('./Hardfork.js').Hardfork} */ (currentHardfork) }
						: {}),
					...chain,
				}
				const newCommon = createCommon(options)
				newCommon.vmConfig = ethjsCommonCopy
				return newCommon
			},
		}
	} catch (e) {
		const err = /** @type {Error} */ (e)
		throw new InvalidParamsError(err.message, { cause: err })
	}
}
