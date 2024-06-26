import type { Abi } from '@tevm/utils'
import type { ContractFunctionName, EncodeFunctionDataParameters, Hex } from '@tevm/utils'
import type { BaseCallParams } from '../BaseCall/BaseCallParams.js'

/**
 * @deprecated Can use `ContraactParams` instead
 * Tevm params for deploying and running a script
 */
export type ScriptParams<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends ContractFunctionName<TAbi> = ContractFunctionName<TAbi>,
	TThrowOnFail extends boolean = boolean,
> = EncodeFunctionDataParameters<TAbi, TFunctionName> &
	BaseCallParams<TThrowOnFail> & {
		/**
		 * The EVM code to run.
		 */
		readonly deployedBytecode: Hex
	}
