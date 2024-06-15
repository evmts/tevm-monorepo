import type { ContractFunctionName, EncodeFunctionDataParameters, Hex } from '@tevm/utils'
import type { BaseCallParams } from '../BaseCall/BaseCallParams.js'
import type { Abi, Address } from '../common/index.js'

/**
 * Tevm params to execute a call on a contract
 */
export type ContractParams<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends ContractFunctionName<TAbi> = ContractFunctionName<TAbi>,
	TThrowOnFail extends boolean = boolean,
> = EncodeFunctionDataParameters<TAbi, TFunctionName> &
	BaseCallParams<TThrowOnFail> &
	(
		| {
				/**
				 * The address to call.
				 */
				readonly to: Address
				deployedBytecode?: never
		  }
		| {
				/**
				 * The address to call.
				 */
				readonly to?: never
				deployedBytecode: Hex
		  }
	)
