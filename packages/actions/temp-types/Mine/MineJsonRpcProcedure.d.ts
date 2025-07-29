import type { MineJsonRpcRequest } from './MineJsonRpcRequest.js';
import type { MineJsonRpcResponse } from './MineJsonRpcResponse.js';
/**
 * Mine JSON-RPC tevm procedure mines 1 or more blocks
 */
export type MineJsonRpcProcedure = (request: MineJsonRpcRequest) => Promise<MineJsonRpcResponse>;
//# sourceMappingURL=MineJsonRpcProcedure.d.ts.map