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
 * Typesafe request handler for JSON-RPC requests. Most users will want to use the higher level
 * and more feature-rich `actions` api
 * @example
 * ```typescript
 * const blockNumberResponse = await tevm.request({
 *  method: 'eth_blockNumber',
 *  params: []
 *  id: 1
 *  jsonrpc: '2.0'
 * })
 * const accountResponse = await tevm.request({
 *  method: 'tevm_getAccount',
 *  params: [{address: '0x123...'}]
 *  id: 1
 *  jsonrpc: '2.0'
 * })
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
export type TevmJsonRpcRequestHandler = <
	TRequest extends
		| TevmJsonRpcRequest
		| EthJsonRpcRequest
		| AnvilJsonRpcRequest
		| DebugJsonRpcRequest,
>(
	request: TRequest,
) => Promise<JsonRpcReturnTypeFromMethod<TRequest['method']>>
