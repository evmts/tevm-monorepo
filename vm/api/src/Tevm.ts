import type { TevmJsonRpcRequestHandler } from './TevmJsonRpcRequestHandler.js'
import type {
	AccountHandler,
	CallHandler,
	ContractHandler,
	EthBlockNumberHandler,
	ScriptHandler,
} from './handlers/index.js'

/**
 * The specification for the Tevm api
 * It has a request method for JSON-RPC requests and more ergonomic handler methods
 * for each type of request
 */
export type Tevm = {
	request: TevmJsonRpcRequestHandler
	script: ScriptHandler
	account: AccountHandler
	call: CallHandler
	contract: ContractHandler
	blockNumber: EthBlockNumberHandler
}
