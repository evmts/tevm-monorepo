import type { JsonRpcResponse } from '@tevm/jsonrpc';
import type { SerializeToJson } from '../utils/SerializeToJson.js';
import type { LoadStateResult } from './LoadStateResult.js';
import type { TevmLoadStateError } from './TevmLoadStateError.js';
/**
 * Response of the `tevm_loadState` RPC method.
 */
export type LoadStateJsonRpcResponse = JsonRpcResponse<'tevm_loadState', SerializeToJson<LoadStateResult>, TevmLoadStateError['code']>;
//# sourceMappingURL=LoadStateJsonRpcResponse.d.ts.map