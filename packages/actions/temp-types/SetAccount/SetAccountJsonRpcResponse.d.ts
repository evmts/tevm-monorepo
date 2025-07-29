import type { JsonRpcResponse } from '@tevm/jsonrpc';
import type { SerializeToJson } from '../utils/SerializeToJson.js';
import type { SetAccountResult } from './SetAccountResult.js';
import type { TevmSetAccountError } from './TevmSetAccountError.js';
/**
 * JSON-RPC response for `tevm_setAccount` method
 */
export type SetAccountJsonRpcResponse = JsonRpcResponse<'tevm_setAccount', SerializeToJson<SetAccountResult>, TevmSetAccountError['code']>;
//# sourceMappingURL=SetAccountJsonRpcResponse.d.ts.map