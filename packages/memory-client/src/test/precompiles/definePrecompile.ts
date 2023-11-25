import { Address } from '@ethereumjs/util'
import { type EvmtsContract } from '@evmts/core'
import { type Hex, toHex } from 'viem'

export abstract class Precompile<
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
	public readonly precompile = () => ({
		address: this.ethjsAddress(),
		function: (params: { data: Uint8Array; gasLimit: bigint }) => {
			return this.call({ data: toHex(params.data), gasLimit: params.gasLimit })
		},
	})
	public abstract readonly call: (context: {
		data: Hex
		gasLimit: bigint
	}) => Promise<{ returnValue: Uint8Array; executionGasUsed: bigint }>
}

export const definePrecompile = <
	TName extends string,
	THumanReadableAbi extends readonly string[],
	TBytecode extends `0x${string}` | undefined,
	TDeployedBytecode extends `0x${string}` | undefined,
>({
	contract,
	address,
	call,
}: Pick<
	Precompile<TName, THumanReadableAbi, TBytecode, TDeployedBytecode>,
	'contract' | 'address' | 'call'
>): Precompile<TName, THumanReadableAbi, TBytecode, TDeployedBytecode> => {
	class PrecompileImplementation extends Precompile<
		TName,
		THumanReadableAbi,
		TBytecode,
		TDeployedBytecode
	> {
		contract = contract
		address = address
		call = call
	}
	return new PrecompileImplementation()
}
