import type { TevmJsonRpcRequestHandler } from './TevmJsonRpcRequestHandler.js'
import type {
	AccountHandler,
	CallHandler,
	ContractHandler,
	ScriptHandler,
} from './handlers/index.js'

/**
 * The specification for a Tevm client
 * It has a request method and quality of life methods for each type of request
 */
export type TevmClient = {
	request: TevmJsonRpcRequestHandler
	script: ScriptHandler
	account: AccountHandler
	call: CallHandler
	contract: ContractHandler
}
