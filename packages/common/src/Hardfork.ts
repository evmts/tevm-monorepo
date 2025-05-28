/**
 * Ethereum hardfork options. Default option is currently prague.
 * If you use older hardforks you might run into issues with EIPs not being supported.
 * @example
 * ```typescript
 * import { createCommon, mainnet } from 'tevm/common'`
 *
 * const hardfork: Hardfork = 'shanghai'
 *
 * const common = createCommon({
 *   ...mainnet,
 *   hardfork,
 * })
 * ```
 * @see [createCommon](https://tevm.sh/reference/tevm/common/functions/createcommon/)
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
