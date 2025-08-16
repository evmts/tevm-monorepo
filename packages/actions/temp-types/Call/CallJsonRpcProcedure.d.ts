import type { CallJsonRpcRequest } from './CallJsonRpcRequest.js';
import type { CallJsonRpcResponse } from './CallJsonRpcResponse.js';
/**
 * Call JSON-RPC procedure executes a call against the tevm EVM
 */
export type CallJsonRpcProcedure = (request: CallJsonRpcRequest) => Promise<CallJsonRpcResponse>;
//# sourceMappingURL=CallJsonRpcProcedure.d.ts.map