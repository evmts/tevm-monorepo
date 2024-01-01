import type { ContractError, ContractResult } from '../index.js'
import type { JsonRpcResponse } from './JsonRpcResponse.js'
import type { Abi } from 'abitype'

export type ContractJsonRpcResponse<
	TAbi extends Abi = Abi,
	TFunctionName extends string = string,
> = JsonRpcResponse<
	'tevm_contract',
	ContractResult<TAbi, TFunctionName>,
	ContractError['_tag']
>
