import type { JsonRpcResponse } from '@tevm/jsonrpc';
import type { SerializeToJson } from '../utils/SerializeToJson.js';
import type { MineResult } from './MineResult.js';
import type { TevmMineError } from './TevmMineError.js';
/**
 * JSON-RPC response for `tevm_mine` method
 */
export type MineJsonRpcResponse = JsonRpcResponse<'tevm_mine', SerializeToJson<MineResult>, TevmMineError['code']>;
//# sourceMappingURL=MineJsonRpcResponse.d.ts.map