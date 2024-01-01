import type { ContractParams, ContractResult } from '../index.js'
import type { Abi } from 'abitype'

export type ContractHandler = <
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
>(
	action: ContractParams<TAbi, TFunctionName>,
) => Promise<ContractResult<TAbi, TFunctionName>>
