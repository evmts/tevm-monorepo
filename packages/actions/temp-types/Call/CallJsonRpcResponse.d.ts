import type { JsonRpcResponse } from '@tevm/jsonrpc';
import type { SerializeToJson } from '../utils/SerializeToJson.js';
import type { CallResult } from './CallResult.js';
import type { TevmCallError } from './TevmCallError.js';
/**
 * JSON-RPC response for `tevm_call` procedure
 */
export type CallJsonRpcResponse = JsonRpcResponse<'tevm_call', SerializeToJson<CallResult>, TevmCallError['code']>;
//# sourceMappingURL=CallJsonRpcResponse.d.ts.map