import type { JsonRpcRequest } from '@tevm/jsonrpc';
import type { ParameterizedTevmState } from '@tevm/state';
import type { SerializeToJson } from '../utils/SerializeToJson.js';
/**
 * The parameters for the `tevm_loadState` method
 */
export type SerializedParams = {
    state: SerializeToJson<ParameterizedTevmState>;
};
/**
 * The JSON-RPC request for the `tevm_loadState` method
 */
export type LoadStateJsonRpcRequest = JsonRpcRequest<'tevm_loadState', [SerializedParams]>;
//# sourceMappingURL=LoadStateJsonRpcRequest.d.ts.map