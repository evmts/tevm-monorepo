import type {
	NonVerboseTevmJsonRpcRequest,
	TevmJsonRpcRequest,
} from './TevmJsonRpcRequest.js'
import {
	tevmCall,
	tevmContractCall,
	tevmPutAccount,
	tevmPutContractCode,
	tevmScript,
} from './handlers/index.js'
import type {
	TevmCallResponse,
	TevmContractCallResponse,
	TevmPutAccountResponse,
	TevmPutContractCodeResponse,
	TevmScriptResponse,
} from './responses/index.js'
import type { EVM } from '@ethereumjs/evm'

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
export const createJsonRpcClient = (evm: EVM) => {
	return <TRequest extends TevmJsonRpcRequest>(
		request: TRequest,
	): Promise<BackendReturnType<TRequest>> => {
		switch (request.method) {
			case 'tevm_call':
				return tevmCall(evm, request) as Promise<BackendReturnType<TRequest>>
			case 'tevm_contractCall':
				return tevmContractCall(evm, request) as Promise<
					BackendReturnType<TRequest>
				>
			case 'tevm_putAccount':
				return tevmPutAccount(evm, request) as Promise<
					BackendReturnType<TRequest>
				>
			case 'tevm_putContractCode':
				return tevmPutContractCode(evm, request) as Promise<
					BackendReturnType<TRequest>
				>
			case 'tevm_script':
				return tevmScript(evm, request) as Promise<BackendReturnType<TRequest>>
			default:
				throw new UnknownMethodError(request)
		}
	}
}

export type JsonRpcClient = ReturnType<typeof createJsonRpcClient>
