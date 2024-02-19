import type {
	CallJsonRpcResponse,
	DebugTraceCallJsonRpcResponse,
	EthBlockNumberJsonRpcResponse,
	EthChainIdJsonRpcResponse,
	EthGasPriceJsonRpcResponse,
	EthGetBalanceJsonRpcResponse,
	EthGetCodeJsonRpcResponse,
	EthGetStorageAtJsonRpcResponse,
	GetAccountJsonRpcResponse,
	ScriptJsonRpcResponse,
	SetAccountJsonRpcResponse,
	TevmJsonRpcRequest,
} from '../index.js'
import type {
	AnvilJsonRpcRequest,
	CallJsonRpcRequest,
	DebugJsonRpcRequest,
	DebugTraceCallJsonRpcRequest,
	EthBlockNumberJsonRpcRequest,
	EthChainIdJsonRpcRequest,
	EthGasPriceJsonRpcRequest,
	EthGetBalanceJsonRpcRequest,
	EthGetCodeJsonRpcRequest,
	EthGetStorageAtJsonRpcRequest,
	EthJsonRpcRequest,
	GetAccountJsonRpcRequest,
	ScriptJsonRpcRequest,
	SetAccountJsonRpcRequest,
} from '../requests/index.js'
import type { JsonRpcReturnTypeFromMethod } from './JsonRpcReturnTypeFromMethod.js'

/**
 * @experimental
 * Bulk request handler for JSON-RPC requests. Takes an array of requests and returns an array of results.
 * Bulk requests are currently handled in parallel which can cause issues if the requests are expected to run
 * sequentially or interphere with each other. An option for configuring requests sequentially or in parallel
 * will be added in the future.
 *
 * Currently is not very generic with regard to input and output types.
 * @example
 * ```typescript
 * const [blockNumberResponse, gasPriceResponse] = await tevm.requestBulk([{
 *  method: 'eth_blockNumber',
 *  params: []
 *  id: 1
 *  jsonrpc: '2.0'
 * }, {
 *  method: 'eth_gasPrice',
 *  params: []
 *  id: 1
 *  jsonrpc: '2.0'
 * }])
 * ```
 *
 * ### tevm_* methods
 *
 * #### tevm_call
 *
 * request - {@link CallJsonRpcRequest}
 * response - {@link CallJsonRpcResponse}
 *
 * #### tevm_script
 *
 * request - {@link ScriptJsonRpcRequest}
 * response - {@link ScriptJsonRpcResponse}
 *
 * #### tevm_getAccount
 *
 * request - {@link GetAccountJsonRpcRequest}
 * response - {@link GetAccountJsonRpcResponse}
 *
 * #### tevm_setAccount
 *
 * request - {@link SetAccountJsonRpcRequest}
 * response - {@link SetAccountJsonRpcResponse}
 *
 * ### debug_* methods
 *
 * #### debug_traceCall
 *
 * request - {@link DebugTraceCallJsonRpcRequest}
 * response - {@link DebugTraceCallJsonRpcResponse}
 *
 * ### eth_* methods
 *
 * #### eth_blockNumber
 *
 * request - {@link EthBlockNumberJsonRpcRequest}
 * response - {@link EthBlockNumberJsonRpcResponse}
 *
 * #### eth_chainId
 *
 * request - {@link EthChainIdJsonRpcRequest}
 * response - {@link EthChainIdJsonRpcResponse}
 *
 * #### eth_getCode
 *
 * request - {@link EthGetCodeJsonRpcRequest}
 * response - {@link EthGetCodeJsonRpcResponse}
 *
 * #### eth_getStorageAt
 *
 * request - {@link EthGetStorageAtJsonRpcRequest}
 * response - {@link EthGetStorageAtJsonRpcResponse}
 *
 * #### eth_gasPrice
 *
 * request - {@link EthGasPriceJsonRpcRequest}
 * response - {@link EthGasPriceJsonRpcResponse}
 *
 * #### eth_getBalance
 *
 * request - {@link EthGetBalanceJsonRpcRequest}
 * response - {@link EthGetBalanceJsonRpcResponse}
 */
export type TevmJsonRpcBulkRequestHandler = (
	requests: ReadonlyArray<
		| TevmJsonRpcRequest
		| EthJsonRpcRequest
		| AnvilJsonRpcRequest
		| DebugJsonRpcRequest
	>,
) => Promise<Array<JsonRpcReturnTypeFromMethod<any>>>
