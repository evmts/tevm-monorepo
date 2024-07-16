import type { Contract } from '@tevm/contract'
import { EthjsAddress, type Address, type Hex } from '@tevm/utils'

/**
 * Type of predeploy contract for tevm
 */
export type Predeploy<TName extends string, THumanReadableAbi extends readonly string[]> = {
	readonly contract: Contract<TName, THumanReadableAbi, Address, Hex, Hex>
	readonly predeploy: () => {
		address: EthjsAddress
	}
}
