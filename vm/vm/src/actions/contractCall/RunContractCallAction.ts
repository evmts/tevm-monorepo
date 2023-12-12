import type { Abi } from 'abitype'
import {
	type Address,
	type EncodeFunctionDataParameters,
} from 'viem'

/**
 * Tevm action to execute a call on a contract
 */
export type RunContractCallAction<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
> = EncodeFunctionDataParameters<TAbi, TFunctionName> & {
	contractAddress: Address
	caller?: Address
	gasLimit?: bigint
}

