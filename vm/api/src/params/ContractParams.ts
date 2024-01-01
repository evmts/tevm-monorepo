import type { BaseCallParams } from './BaseCallParams.js'
import type { Abi, Address } from 'abitype'
import { type EncodeFunctionDataParameters } from 'viem'

/**
 * Tevm action to execute a call on a contract
 */
export type ContractParams<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
> = EncodeFunctionDataParameters<TAbi, TFunctionName> &
	BaseCallParams & {
		/**
		 * The address to call.
		 */
		to: Address
	}
