import type { TevmContractCallRequest } from './contractCall/TevmContractCallRequest.js'
import type { TevmPutAccountRequest } from './putAccount/TevmPutAccountRequest.js'
import type { TevmPutContractCodeRequest } from './putContractCode/TevmPutContractCodeRequest.js'
import type { TevmCallRequest } from './runCall/TevmCallRequest.js'
import type { TevmScriptRequest } from './runScript/TevmScriptRequest.js'

export type TevmJsonRpcRequest =
	| TevmContractCallRequest
	| TevmPutAccountRequest
	| TevmPutContractCodeRequest
	| TevmCallRequest
	| TevmScriptRequest
