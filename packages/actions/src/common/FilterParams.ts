import type { Address } from './Address.js'
import type { BlockParam } from './BlockParam.js'
import type { Hex } from './Hex.js'

/**
 * An event filter options object
 */
export type FilterParams = {
	readonly fromBlock?: BlockParam
	readonly toBlock?: BlockParam
	readonly address?: Address | Address[]
	readonly topics?: ReadonlyArray<Hex | null | ReadonlyArray<Hex | null>>
}
