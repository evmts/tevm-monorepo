import type { ContractError, ContractResult } from '../index.js'
import type { JsonRpcResponse } from './JsonRpcResponse.js'
import type { Abi } from 'abitype'
import type { ContractFunctionName } from 'viem'

export type ContractJsonRpcResponse<
	TAbi extends Abi = Abi,
	TFunctionName extends ContractFunctionName<TAbi> = ContractFunctionName<TAbi>,
> = JsonRpcResponse<
	'tevm_contract',
	ContractResult<TAbi, TFunctionName>,
	ContractError['_tag']
>
