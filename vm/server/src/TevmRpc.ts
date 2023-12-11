import type { PutAccountAction, RunScriptAction, PutContractCodeAction, RunCallAction, RunContractCallAction, RunContractCallResult, RunScriptResult, Tevm } from '@tevm/vm'
import type { Abi } from 'abitype'
import { JsonRpcSuccessResponse } from './jsonrpc/JsonRpcSuccessResponse'
import { JsonRpcRequest } from './jsonrpc/JsonRpcRequest'

export type TevmContractCall = <
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
	TRequest extends JsonRpcRequest = {
		params: RunContractCallAction<TAbi, TFunctionName>,
		jsonrpc: '2.0',
		method: 'tevm_contractCall',
		id?: string | number | null,
	},
	TResponse extends JsonRpcSuccessResponse = {
		jsonrpc: '2.0',
		method: 'tevm_contractCall',
		result: RunContractCallResult<TAbi, TFunctionName>,
		id?: string | number | null,
	}
>(request: TRequest) => Promise<TResponse>

export type TevmScript = <
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
	TRequest extends JsonRpcRequest = {
		params: RunScriptAction<TAbi, TFunctionName>,
		jsonrpc: '2.0',
		method: 'tevm_script',
		id?: string | number | null,
	},
	TResponse extends JsonRpcSuccessResponse = {
		jsonrpc: '2.0',
		method: 'tevm_script',
		result: RunScriptResult<TAbi, TFunctionName>,
		id?: string | number | null,
	}
>(
	request: TRequest,
) => Promise<TResponse>

export type TevmCall = (request: JsonRpcRequest & { params: RunCallAction }) =>
	Promise<JsonRpcSuccessResponse & { result: Awaited<ReturnType<Tevm['runCall']>> }>

export type TevmPutContractCode = (request: JsonRpcRequest & { params: PutContractCodeAction }) =>
	Promise<JsonRpcSuccessResponse & { result: Awaited<ReturnType<Tevm['putContractCode']>> }>

export type TevmPutAccount = (request: JsonRpcRequest & { params: PutAccountAction }) =>
	Promise<JsonRpcSuccessResponse & { result: Awaited<ReturnType<Tevm['putAccount']>> }>

export type TevmRpc = {
	tevm_contractCall: TevmContractCall
	tevm_script: TevmScript
	tevm_call: TevmCall
	tevm_putContractCode: TevmPutContractCode
	tevm_putAccount: TevmPutAccount
}
