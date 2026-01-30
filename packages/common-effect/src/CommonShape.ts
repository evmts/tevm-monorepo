/**
 * @module @tevm/common-effect/CommonShape
 * Type definitions for the CommonShape interface
 */

import type { Common } from '@tevm/common'

/**
 * Ethereum hardfork identifier
 */
export type Hardfork =
	| 'chainstart'
	| 'homestead'
	| 'dao'
	| 'tangerineWhistle'
	| 'spuriousDragon'
	| 'byzantium'
	| 'constantinople'
	| 'petersburg'
	| 'istanbul'
	| 'muirGlacier'
	| 'berlin'
	| 'london'
	| 'arrowGlacier'
	| 'grayGlacier'
	| 'mergeForkIdTransition'
	| 'paris'
	| 'shanghai'
	| 'cancun'
	| 'prague'
	| 'osaka'

/**
 * Common shape interface providing chain configuration
 */
export interface CommonShape {
	/**
	 * The underlying Common object from @tevm/common
	 */
	readonly common: Common
	/**
	 * The chain ID
	 */
	readonly chainId: number
	/**
	 * The active hardfork
	 */
	readonly hardfork: Hardfork
	/**
	 * Enabled EIPs
	 */
	readonly eips: readonly number[]
	/**
	 * Create an independent copy of the Common object
	 */
	readonly copy: () => Common
}
