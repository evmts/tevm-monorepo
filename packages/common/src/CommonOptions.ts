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
}
