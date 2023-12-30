import type { RunContractCallAction } from '../actions/contractCall/RunContractCallAction.js'
import type { RunContractCallResult } from '../actions/contractCall/RunContractCallResult.js'
import type { PutAccountAction } from '../actions/index.js'
import type { PutContractCodeAction } from '../actions/putContractCode/PutContractCodeAction.js'
import type { RunCallAction } from '../actions/runCall/RunCallAction.js'
import type { RunScriptAction } from '../actions/runScript/RunScriptAction.js'
import type { RunScriptResult } from '../actions/runScript/RunScriptResult.js'
import type { TevmJsonRpcRequest } from '../jsonrpc/TevmJsonRpcRequest.js'
import type { BackendReturnType } from '../jsonrpc/createJsonRpcClient.js'
import type { TevmPutAccountResponse } from '../jsonrpc/putAccount/TevmPutAccountResponse.js'
import type { TevmPutContractCodeResponse } from '../jsonrpc/putContractCode/TevmPutContractCodeResponse.js'
import type { TevmCallResponse } from '../jsonrpc/runCall/TevmCallResponse.js'
import type { Abi } from 'abitype'
import { parse, stringify } from 'superjson'
import { http } from 'viem'

export type Client = {
	request<T extends TevmJsonRpcRequest>(r: T): Promise<BackendReturnType<T>>
	runScript<
		TAbi extends Abi | readonly unknown[] = Abi,
		TFunctionName extends string = string,
	>(
		action: RunScriptAction<TAbi, TFunctionName>,
	): Promise<RunScriptResult<TAbi, TFunctionName>>
	putAccount(action: PutAccountAction): Promise<TevmPutAccountResponse>
	putContractCode(
		action: PutContractCodeAction,
	): Promise<TevmPutContractCodeResponse>
	runCall(action: RunCallAction): Promise<TevmCallResponse>
	runContractCall<
		TAbi extends Abi | readonly unknown[] = Abi,
		TFunctionName extends string = string,
	>(
		action: RunContractCallAction<TAbi, TFunctionName>,
	): Promise<RunContractCallResult<TAbi, TFunctionName>>
}

export function createClient(rpcUrl: string): Client {
	const httpRequest = http(rpcUrl)({})

	const request = async <T extends TevmJsonRpcRequest>(
		r: T,
	): Promise<BackendReturnType<T>> => {
		const asSuperJson = JSON.parse(stringify(r))
		return httpRequest.request(asSuperJson)
	}

	return {
		request,
		runScript: async <
			TAbi extends Abi | readonly unknown[] = Abi,
			TFunctionName extends string = string,
		>(
			action: RunScriptAction<TAbi, TFunctionName>,
		): Promise<RunScriptResult<TAbi, TFunctionName>> => {
			const res = await request({
				jsonrpc: '2.0',
				method: 'tevm_script',
				params: action as any,
			})
			const parsedSuperjson = parse(JSON.stringify(res.result))
			return parsedSuperjson as RunScriptResult<TAbi, TFunctionName>
		},

		putAccount: async (
			action: PutAccountAction,
		): Promise<TevmPutAccountResponse> => {
			const res = await request({
				jsonrpc: '2.0',
				method: 'tevm_putAccount',
				params: action as any,
			})
			const parsedSuperjson = parse(JSON.stringify(res.result))
			return parsedSuperjson as TevmPutAccountResponse
		},

		putContractCode: async (
			action: PutContractCodeAction,
		): Promise<TevmPutContractCodeResponse> => {
			const res = await request({
				jsonrpc: '2.0',
				method: 'tevm_putContractCode',
				params: action as any,
			})
			const parsedSuperjson = parse(JSON.stringify(res.result))
			return parsedSuperjson as TevmPutContractCodeResponse
		},

		runCall: async (action: RunCallAction): Promise<TevmCallResponse> => {
			const res = await request({
				jsonrpc: '2.0',
				method: 'tevm_call',
				params: action as any,
			})
			const parsedSuperjson = parse(JSON.stringify(res.result))
			return parsedSuperjson as TevmCallResponse
		},

		runContractCall: async <
			TAbi extends Abi | readonly unknown[] = Abi,
			TFunctionName extends string = string,
		>(
			action: RunContractCallAction<TAbi, TFunctionName>,
		): Promise<RunContractCallResult<TAbi, TFunctionName>> => {
			const res = await request({
				jsonrpc: '2.0',
				method: 'tevm_contractCall',
				params: action as any,
			})
			const parsedSuperjson = parse(JSON.stringify(res.result))
			return parsedSuperjson as RunContractCallResult<TAbi, TFunctionName>
		},
	}
}
