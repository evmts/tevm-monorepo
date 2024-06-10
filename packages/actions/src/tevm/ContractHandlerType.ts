import type { Abi } from '@tevm/utils'
import type { ContractFunctionName } from '@tevm/utils'
import type { ContractParams } from './ContractParams.js'
import type { ContractResult } from './ContractResult.js'

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
