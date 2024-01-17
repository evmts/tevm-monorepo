import type { TevmJsonRpcRequestHandler } from './TevmJsonRpcRequestHandler.js'
import type {
	AccountHandler,
	CallHandler,
	ContractHandler,
	DumpStateHandler,
	// DebugTraceCallHandler,
	// DebugTraceTransactionHandler,
	EthBlockNumberHandler,
	// EthCallHandler,
	EthChainIdHandler,
	EthGasPriceHandler,
	EthGetBalanceHandler,
	EthGetCodeHandler,
	EthGetStorageAtHandler,
	LoadStateHandler,
	ScriptHandler,
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
	dumpState: DumpStateHandler
	loadState: LoadStateHandler
	eth: {
		blockNumber: EthBlockNumberHandler
		chainId: EthChainIdHandler
		// call: EthCallHandler
		getCode: EthGetCodeHandler
		getStorageAt: EthGetStorageAtHandler
		gasPrice: EthGasPriceHandler
		getBalance: EthGetBalanceHandler
	}
	// Eth Handlers
	// debug handlers
	// traceTransaction: DebugTraceTransactionHandler
	// traceCall: DebugTraceCallHandler
	// anvil handlers
	// Not implementing any yet
	// hardhat handlers
	// Not implementing any yet
	// Ganache handlers
	// Not implementing any yet
	// Compile handlers
	// Not implementing any yet
	blockNumber: EthBlockNumberHandler
}
