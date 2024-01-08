import type { ScriptParams, ScriptResult } from '../index.js'
import type { Abi } from 'abitype'
import type { ContractFunctionName } from 'viem'

/**
 * Handler for script tevm procedure
 */
export type ScriptHandler = <
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends ContractFunctionName<TAbi> = ContractFunctionName<TAbi>,
>(
	params: ScriptParams<TAbi, TFunctionName>,
) => Promise<ScriptResult<TAbi, TFunctionName>>
