import type { ContractParams, ContractResult } from '../index.js'
import type { Abi } from '@tevm/utils'
import type { ContractFunctionName } from '@tevm/utils'

// this handler is adapted from viem and purposefully matches the viem api (not exactly but close enough)

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
