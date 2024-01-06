import type { ContractParams } from '../index.js'
import type { JsonRpcRequest } from './JsonRpcRequest.js'
import type { Abi } from 'abitype'
import type { ContractFunctionName } from 'viem'

export type ContractJsonRpcRequest<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends ContractFunctionName<TAbi> = ContractFunctionName<TAbi>,
> = JsonRpcRequest<'tevm_contract', ContractParams<TAbi, TFunctionName>>
