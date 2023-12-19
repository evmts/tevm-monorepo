import { Address } from '@ethereumjs/util'
import { type EvmtsContract } from '@evmts/core'

//Make predeploy call evm function
export abstract class Predeploy<
	TName extends string,
	THumanReadableAbi extends readonly string[],
	TBytecode extends `0x${string}` | undefined,
	TDeployedBytecode extends `0x${string}` | undefined,
> {
	public abstract readonly contract: EvmtsContract<
		TName,
		THumanReadableAbi,
		TBytecode,
		TDeployedBytecode
	>
	public abstract readonly address: `0x${string}`
	protected readonly ethjsAddress = () => Address.fromString(this.address)
	public readonly predeploy = () => ({
		address: this.ethjsAddress(),
	})
}

export const definePredeploy = <
	TName extends string,
	THumanReadableAbi extends readonly string[],
	TBytecode extends `0x${string}` | undefined,
	TDeployedBytecode extends `0x${string}` | undefined,
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
		address = address
	}
	return new PredeployImplementation()
}
