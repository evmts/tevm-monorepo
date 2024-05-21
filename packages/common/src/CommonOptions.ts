import type { CustomCrypto } from '@ethereumjs/common'
import type { LogOptions } from '@tevm/logger'
import type { Hardfork } from './Hardfork.js'

/**
 * Options for creating an Tevm MemoryClient instance
 */
export type CommonOptions = {
	/**
	 * The network chain id
	 */
	chainId: bigint
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
	 */
	customCrypto?: CustomCrypto
}
