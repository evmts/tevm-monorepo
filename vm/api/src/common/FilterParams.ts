import type { Address } from 'abitype'
import type { BlockTag, Hex } from 'viem'

/**
 * An event filter optionsobject
 */
export type FilterParams = {
	readonly fromBlock: BlockTag | Hex
	readonly toBlock: BlockTag | Hex
	readonly address: Address
	readonly topics: ReadonlyArray<Hex>
}
