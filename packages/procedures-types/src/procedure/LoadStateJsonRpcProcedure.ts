import type { LoadStateJsonRpcRequest } from '../requests/LoadStateJsonRpcRequest.js'
import type { LoadStateJsonRpcResponse } from '../responses/LoadStateJsonRpcResponse.js'

/**
 * Procedure for handling script JSON-RPC requests
 * Procedure for handling tevm_loadState JSON-RPC requests
 * @returns jsonrpc error response if there are errors otherwise it returns a successful empty object result
 * @example
 * const result = await tevm.request({
 *.   method: 'tevm_loadState',
 *    params: { '0x..': '0x...', ...},
 *.   id: 1,
 *   jsonrpc: '2.0'
 *. }
 * console.log(result) // { jsonrpc: '2.0', id: 1, method: 'tevm_loadState', result: {}}
 */
export type LoadStateJsonRpcProcedure = (
	request: LoadStateJsonRpcRequest,
) => Promise<LoadStateJsonRpcResponse>
