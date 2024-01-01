import { Address as EthjsAddress } from '@ethereumjs/util'
import { type TevmContract } from '@tevm/contract'
import { type Address } from 'abitype'
import { getAddress } from 'viem'

export type CustomPredeploy<
	TName extends string,
	THumanReadableAbi extends ReadonlyArray<string>,
	TBytecode extends `0x${string}` | undefined,
	TDeployedBytecode extends `0x${string}` | undefined,
> = {
	address: Address
	contract: TevmContract<TName, THumanReadableAbi, TBytecode, TDeployedBytecode>
}

export abstract class Predeploy<
	TName extends string,
	THumanReadableAbi extends readonly string[],
	TBytecode extends `0x${string}` | undefined,
	TDeployedBytecode extends `0x${string}` | undefined,
> {
	public abstract readonly contract: TevmContract<
		TName,
		THumanReadableAbi,
		TBytecode,
		TDeployedBytecode
	>
	public abstract readonly address: Address
	protected readonly ethjsAddress = () => EthjsAddress.fromString(this.address)
	public readonly predeploy = () => ({
		address: this.ethjsAddress(),
	})
}

export const definePredeploy = <
	TName extends string,
	THumanReadableAbi extends readonly string[],
	TBytecode extends `0x${string}`,
	TDeployedBytecode extends `0x${string}`,
>({
	contract,
	address,
}: Pick<
	Predeploy<TName, THumanReadableAbi, TBytecode, TDeployedBytecode>,
	'contract' | 'address'
>): Predeploy<TName, THumanReadableAbi, TBytecode, TDeployedBytecode> => {
	class PredeployImplementation extends Predeploy<
		TName,
		THumanReadableAbi,
		TBytecode,
		TDeployedBytecode
	> {
		contract = contract
		address = getAddress(address)
	}
	return new PredeployImplementation()
}
