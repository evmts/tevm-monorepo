import type { BaseCallParams } from './BaseCallParams.js'
import type { Abi } from 'abitype'
import { type EncodeFunctionDataParameters, type Hex } from 'viem'

/**
 * Tevm action to deploy and execute a script or contract
 */
export type ScriptParams<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
> = EncodeFunctionDataParameters<TAbi, TFunctionName> &
	BaseCallParams & {
		/**
		 * The EVM code to run.
		 */
		deployedBytecode: Hex
	}
