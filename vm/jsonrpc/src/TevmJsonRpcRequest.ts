import type {
	TevmCallRequest,
	TevmContractCallRequest,
	TevmPutAccountRequest,
	TevmPutContractCodeRequest,
	TevmScriptRequest,
} from './requests/index.js'

export type TevmJsonRpcRequest =
	| TevmContractCallRequest
	| TevmPutAccountRequest
	| TevmPutContractCodeRequest
	| TevmCallRequest
	| TevmScriptRequest

export type NonVerboseTevmJsonRpcRequest =
	| Pick<TevmContractCallRequest, 'method' | 'params'>
	| Pick<TevmPutAccountRequest, 'method' | 'params'>
	| Pick<TevmPutContractCodeRequest, 'method' | 'params'>
	| Pick<TevmCallRequest, 'method' | 'params'>
	| Pick<TevmScriptRequest, 'method' | 'params'>
