import type { CustomCrypto } from '@ethereumjs/common'
import type { LogOptions } from '@tevm/logger'
import type { Chain as ViemChain } from 'viem/chains'
import type { Hardfork } from './Hardfork.js'

/**
 * Options for creating an Tevm MemoryClient instance
 */
export type CommonOptions = {
	/**
	 * Hardfork to use. Defaults to `shanghai`
	 */
	hardfork: Hardfork
	/**
	 * Eips to enable. Defaults to `[1559, 4895]`
	 */
	eips?: ReadonlyArray<number>
	/**
	 * Tevm logger instance
	 */
	loggingLevel: LogOptions['level']
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
} & ViemChain
