import type { Abi, Address } from '../common/index.js'
import type { BaseCallParams } from './BaseCallParams.js'
import {
	type ContractFunctionName,
	type EncodeFunctionDataParameters,
} from '@tevm/utils'

/**
 * Tevm params to execute a call on a contract
 */
export type ContractParams<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends ContractFunctionName<TAbi> = ContractFunctionName<TAbi>,
	TThrowOnFail extends boolean = boolean,
> = EncodeFunctionDataParameters<TAbi, TFunctionName> &
	BaseCallParams<TThrowOnFail> & {
		/**
		 * The address to call.
		 */
		to: Address
	}
