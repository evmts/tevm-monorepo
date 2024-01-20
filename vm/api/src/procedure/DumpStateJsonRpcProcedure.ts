import type { DumpStateJsonRpcRequest } from '../requests/DumpStateJsonRpcRequest.js'
import type { DumpStateJsonRpcResponse } from '../responses/DumpStateJsonRpcResponse.js'

/**
 * Procedure for handling tevm_dumpState JSON-RPC requests
 * @returns the state as a JSON-RPC successful result
 * @example
 * const result = await tevm.request({
 *.   method: 'tevm_DumpState',
 *    params: [],
 *.   id: 1,
 *   jsonrpc: '2.0'
 *. }
 * console.log(result) // { jsonrpc: '2.0', id: 1, method: 'tevm_dumpState', result: {'0x...': '0x....', ...}}
 */
export type DumpStateJsonRpcProcedure = (
	request: DumpStateJsonRpcRequest,
) => Promise<DumpStateJsonRpcResponse>
