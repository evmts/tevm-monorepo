import type {
	ContractError,
	ContractParams,
	ContractResult,
	JsonRpcRequest,
	JsonRpcResponse,
} from '../index.js'
import type { Abi } from 'abitype'

export type ContractJsonRpcProcedure = <
	TAbi extends Abi,
	TFunctionName extends string,
>(
	request: JsonRpcRequest<'tevm_contract', ContractParams<TAbi, TFunctionName>>,
) => Promise<
	JsonRpcResponse<
		'tevm_contract',
		ContractResult<TAbi, TFunctionName, never>,
		ContractError['_tag']
	>
>
