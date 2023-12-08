import type { TevmContract } from './TevmContract'
import type { Abi, FormatAbi } from 'abitype'
import type { Hex } from 'viem'

export type TevmContractFromAbi<
	TName extends string,
	TAbi extends Abi,
	TBytecode extends Hex | undefined,
	TDeployedBytecode extends Hex | undefined,
> = TevmContract<TName, FormatAbi<TAbi>, TBytecode, TDeployedBytecode>
