import type { ContractParams } from '../index.js'
import type { JsonRpcRequest } from './JsonRpcRequest.js'
import type { Abi } from 'abitype'

export type ContractJsonRpcRequest<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
> = JsonRpcRequest<'tevm_contract', ContractParams<TAbi, TFunctionName>>
