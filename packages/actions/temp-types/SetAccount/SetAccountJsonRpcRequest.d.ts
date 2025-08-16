import type { JsonRpcRequest } from '@tevm/jsonrpc';
import type { SerializeToJson } from '../utils/SerializeToJson.js';
import type { SetAccountParams } from './SetAccountParams.js';
/**
 * JSON-RPC request for `tevm_setAccount` method
 */
export type SetAccountJsonRpcRequest = JsonRpcRequest<'tevm_setAccount', [SerializeToJson<SetAccountParams>]>;
//# sourceMappingURL=SetAccountJsonRpcRequest.d.ts.map