import type { CustomCrypto } from '@ethereumjs/common'
import type { LogOptions } from '@tevm/logger'
import type { Chain as ViemChain } from 'viem/chains'
import type { Hardfork } from './Hardfork.js'

/**
 * @property {Hardfork} [hardfork='cancun'] - Hardfork to use
 * @property {ReadonlyArray<number>} [eips=[1559, 4895]] - EIPs to enable
 * @property {LogOptions['level']} loggingLevel - Tevm logger instance
 * @property {CustomCrypto} [customCrypto] - Custom crypto implementations
 * Options for creating a Tevm Common instance
 * @example
 * ```typescript
 * import { mainnet, createCommon, type CommonOptions } from 'tevm/common'
 *
 * const opts: CommonOptions = {
 *   ...mainnet,
 *   hardfork: 'london',
 * }
 *
 * const common = createCommon(opts)
 * ```
 *
 * You can also create a Common instance from viem chains:
 * @example
 * ```typescript
 * import { mainnet } from 'viem/chains'
 * import { createCommon } from 'tevm/common'
 *
 * const common = createCommon({
 *   ...mainnet,
 *   hardfork: 'prague',
 * })
 * ```
 *
 * @see [createCommon](https://tevm.sh/reference/tevm/common/functions/createcommon/)
 */
export type CommonOptions = ViemChain & {
	/**
	 * Hardfork to use. Defaults to `prague`
	 * @default 'prague'
	 */
	hardfork?: Hardfork | undefined
	/**
	 * Eips to enable. Defaults to `[1559, 4895]`
	 * @default [1559, 4895]
	 */
	eips?: ReadonlyArray<number> | undefined
	/**
	 * Logging level of the Tevm logger instance
	 * @default 'warn'
	 */
	loggingLevel?: LogOptions['level'] | undefined
	/**
	 * Custom crypto implementations
	 * For EIP-4844 support kzg must be passed
	 * @warning KZG can add a significant amount of bundle size to an app
	 * In future a stub will be provided that that automatically returns valid without checking the kzg proof
	 * @example
	 * ```typescript
	 * import  { createMemoryClient } from 'tevm'
	 * import  { mainnet } from 'tevm/common'
	 * import { createMockKzg } from 'tevm/crypto'
	 *
	 * const common = createCommon({
	 *   ...mainnet,
	 *   customCrypto: {
	 *     kzg: createMockKzg(),
	 *     ...customCrypto,
	 *   },
	 * })
	 * ```
	 */
	customCrypto?: CustomCrypto
}
