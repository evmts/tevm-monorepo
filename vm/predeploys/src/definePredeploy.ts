import { Address as EthjsAddress } from '@ethereumjs/util'
import { type Script } from '@tevm/contract'
import { type Address } from 'abitype'
import { getAddress } from 'viem'

export type CustomPredeploy<
	TName extends string,
	THumanReadableAbi extends ReadonlyArray<string>,
> = {
	address: Address
	contract: Script<TName, THumanReadableAbi>
}

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

export const definePredeploy = <
	TName extends string,
	THumanReadableAbi extends readonly string[],
>({
	contract,
	address,
}: Pick<
	Predeploy<TName, THumanReadableAbi>,
	'contract' | 'address'
>): Predeploy<TName, THumanReadableAbi> => {
	class PredeployImplementation extends Predeploy<TName, THumanReadableAbi> {
		contract = contract
		address = getAddress(address)
	}
	return new PredeployImplementation()
}
