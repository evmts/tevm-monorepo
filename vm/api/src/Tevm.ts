import type { TevmJsonRpcRequestHandler } from './TevmJsonRpcRequestHandler.js'
import type {
	AccountHandler,
	CallHandler,
	ContractHandler,
	DebugTraceCallHandler,
	DebugTraceTransactionHandler,
	EthBlockNumberHandler,
	EthChainIdHandler,
	EthGasPriceHandler,
	EthGetBalanceHandler,
	EthGetCodeHandler,
	EthGetStorageAtHandler,
	ScriptHandler,
	TraceCallHandler,
	TraceContractHandler,
	TraceScriptHandler,
} from './handlers/index.js'

/**
 * The specification for the Tevm api
 * It has a request method for JSON-RPC requests and more ergonomic handler methods
 * for each type of request
 */
export type Tevm = {
	request: TevmJsonRpcRequestHandler
	// Tevm Handlers
	script: ScriptHandler
	account: AccountHandler
	call: CallHandler
	contract: ContractHandler
	traceCall: TraceCallHandler
	traceContract: TraceContractHandler
	traceScript: TraceScriptHandler
	eth: {
		blockNumber: EthBlockNumberHandler
		chainId: EthChainIdHandler
		getCode: EthGetCodeHandler
		getStorageAt: EthGetStorageAtHandler
		gasPrice: EthGasPriceHandler
		getBalance: EthGetBalanceHandler
	}
	debug: {
		traceTransaction: DebugTraceTransactionHandler
		traceCall: DebugTraceCallHandler
	}
}
