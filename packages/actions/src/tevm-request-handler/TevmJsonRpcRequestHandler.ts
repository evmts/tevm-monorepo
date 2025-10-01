import type { AnvilJsonRpcRequest } from '../anvil/AnvilJsonRpcRequest.js'
import type { DebugJsonRpcRequest } from '../debug/DebugJsonRpcRequest.js'
import type { EthJsonRpcRequest } from '../eth/EthJsonRpcRequest.js'
import type { TevmJsonRpcRequest } from '../TevmJsonRpcRequest.js'
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
 *
 * #### eth_createAccessList
 *
 * Creates an access list for a transaction.
 * Returns list of addresses and storage keys that the transaction plans to access.
 *
 * request - {@link EthCreateAccessListJsonRpcRequest}
 * response - {@link EthCreateAccessListJsonRpcResponse}
 *
 * ```typescript
 * const response = await tevm.request({
 *   method: 'eth_createAccessList',
 *   params: [{
 *     to: '0x...',
 *     data: '0x...'
 *   }],
 *   id: 1,
 *   jsonrpc: '2.0'
 * })
 * ```
 */
export type TevmJsonRpcRequestHandler = <
	TRequest extends TevmJsonRpcRequest | EthJsonRpcRequest | AnvilJsonRpcRequest | DebugJsonRpcRequest,
>(
	request: TRequest,
) => Promise<JsonRpcReturnTypeFromMethod<TRequest['method']>>
