import type { Address } from './Address.js'
import type { Hex } from './Hex.js'
import type { BlockParam } from './BlockParam.js'

/**
 * An event filter optionsobject
 */
export type FilterParams = {
	readonly fromBlock: BlockParam
	readonly toBlock: BlockParam
	readonly address: Address
	readonly topics: ReadonlyArray<Hex>
}
