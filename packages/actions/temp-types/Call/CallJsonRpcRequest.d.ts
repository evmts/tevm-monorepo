import type { JsonRpcRequest } from '@tevm/jsonrpc';
import type { SerializeToJson } from '../utils/SerializeToJson.js';
import type { CallParams } from './CallParams.js';
/**
 * JSON-RPC request for `tevm_call`
 */
export type CallJsonRpcRequest = JsonRpcRequest<'tevm_call', [
    params: SerializeToJson<Omit<CallParams, 'stateOverrideSet' | 'blockOverrideSet'>>,
    stateOverrideSet?: SerializeToJson<CallParams['stateOverrideSet']>,
    blockOverrideSet?: SerializeToJson<CallParams['blockOverrideSet']>
]>;
//# sourceMappingURL=CallJsonRpcRequest.d.ts.map