import type { Tevm } from '../Tevm.js'
import type {
	NonVerboseTevmJsonRpcRequest,
	TevmJsonRpcRequest,
} from './TevmJsonRpcRequest.js'
import type { TevmContractCallResponse } from './contractCall/TevmContractCallResponse.js'
import {
	tevmCall,
	tevmContractCall,
	tevmPutAccount,
	tevmPutContractCode,
	tevmScript,
} from './index.js'
import type { TevmPutAccountResponse } from './putAccount/TevmPutAccountResponse.js'
import type { TevmPutContractCodeResponse } from './putContractCode/TevmPutContractCodeResponse.js'
import type { TevmCallResponse } from './runCall/TevmCallResponse.js'
import type { TevmScriptResponse } from './runScript/TevmScriptResponse.js'

export class UnknownMethodError extends Error {
	override name = 'UnknownMethodError'
	_tag = 'UnknownMethodError'
	constructor(request: never) {
		super(`Unknown method in request: ${JSON.stringify(request)}`)
	}
}

export type BackendReturnType<T extends NonVerboseTevmJsonRpcRequest> =
	T extends {
		method: 'tevm_call'
	}
		? TevmCallResponse
		: T extends { method: 'tevm_contractCall' }
		? TevmContractCallResponse<
				T['params']['abi'],
				T['params']['functionName'] & string
		  >
		: T extends { method: 'tevm_putAccount' }
		? TevmPutAccountResponse
		: T extends { method: 'tevm_putContractCode' }
		? TevmPutContractCodeResponse
		: T extends { method: 'tevm_script' }
		? TevmScriptResponse<
				T['params']['abi'],
				T['params']['functionName'] & string
		  >
		: never

/**
 * Creates a vanillajs jsonrpc handler for tevm requests
 * Infers return type from request
 * @example
 * ```typescript
 * const handler = createJsonrpcClient(tevm)
 * const res = await handler({
 *  jsonrpc: '2.0',
 *  id: '1',
 *  method: 'tevm_call',
 *  params: {
 *    to: '0x000000000'
 *  }
 * })
 * ```
 */
export const createJsonRpcClient = (tevm: Tevm) => {
	return <TRequest extends TevmJsonRpcRequest>(
		request: TRequest,
	): Promise<BackendReturnType<TRequest>> => {
		switch (request.method) {
			case 'tevm_call':
				return tevmCall(tevm, request) as Promise<BackendReturnType<TRequest>>
			case 'tevm_contractCall':
				return tevmContractCall(tevm, request) as Promise<
					BackendReturnType<TRequest>
				>
			case 'tevm_putAccount':
				return tevmPutAccount(tevm, request) as Promise<
					BackendReturnType<TRequest>
				>
			case 'tevm_putContractCode':
				return tevmPutContractCode(tevm, request) as Promise<
					BackendReturnType<TRequest>
				>
			case 'tevm_script':
				return tevmScript(tevm, request) as Promise<BackendReturnType<TRequest>>
			default:
				throw new UnknownMethodError(request)
		}
	}
}

export type JsonRpcClient = ReturnType<typeof createJsonRpcClient>
