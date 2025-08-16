import type { JsonRpcResponse } from '@tevm/jsonrpc';
import type { SerializeToJson } from '../utils/SerializeToJson.js';
import type { GetAccountResult } from './GetAccountResult.js';
import type { TevmGetAccountError } from './TevmGetAccountError.js';
/**
 * JSON-RPC response for `tevm_getAccount` method
 */
export type GetAccountJsonRpcResponse = JsonRpcResponse<'tevm_getAccount', SerializeToJson<GetAccountResult>, TevmGetAccountError['code']>;
//# sourceMappingURL=GetAccountJsonRpcResponse.d.ts.map