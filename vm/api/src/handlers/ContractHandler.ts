import type { ContractParams, ContractResult } from '../index.js'
import type { Abi } from 'abitype'
import type { ContractFunctionName } from 'viem'

/**
 * Handler for contract tevm procedure
 * It's API resuses the viem `contractRead`/`contractWrite` API to encode abi, functionName, and args
 */
export type ContractHandler = <
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends ContractFunctionName<TAbi> = ContractFunctionName<TAbi>,
>(
	action: ContractParams<TAbi, TFunctionName>,
) => Promise<ContractResult<TAbi, TFunctionName>>
