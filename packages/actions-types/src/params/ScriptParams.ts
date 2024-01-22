import type { BaseCallParams } from './BaseCallParams.js'
import type { Abi } from 'abitype'
import {
	type ContractFunctionName,
	type EncodeFunctionDataParameters,
	type Hex,
} from 'viem'

/**
 * Tevm params for deploying and running a script
 */
export type ScriptParams<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends ContractFunctionName<TAbi> = ContractFunctionName<TAbi>,
> = EncodeFunctionDataParameters<TAbi, TFunctionName> &
	BaseCallParams & {
		/**
		 * The EVM code to run.
		 */
		deployedBytecode: Hex
	}
