import { Address as EthjsAddress } from '@ethereumjs/util'
import { type Script } from '@tevm/contract'
import { type Address } from '@tevm/utils'

/**
 * Type of predeploy contract for tevm
 */
export abstract class Predeploy<
	TName extends string,
	THumanReadableAbi extends readonly string[],
> {
	public abstract readonly contract: Script<TName, THumanReadableAbi>
	public abstract readonly address: Address
	protected readonly ethjsAddress = () => EthjsAddress.fromString(this.address)
	public readonly predeploy = () => ({
		address: this.ethjsAddress(),
	})
}
