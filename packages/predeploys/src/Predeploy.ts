import type { Contract } from '@tevm/contract'
import { type Address, EthjsAddress, type Hex } from '@tevm/utils'

/**
 * Type of predeploy contract for tevm
 */
export class Predeploy<TName extends string, THumanReadableAbi extends readonly string[]> {
	constructor(public readonly contract: Contract<TName, THumanReadableAbi, Address, Hex, Hex>) {}
	protected readonly ethjsAddress = () => EthjsAddress.fromString(this.contract.address)
	public readonly predeploy = () => ({
		address: this.ethjsAddress(),
	})
}
