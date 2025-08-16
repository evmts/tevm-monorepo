import type { JsonRpcRequest } from '@tevm/jsonrpc';
import type { Hex } from '@tevm/utils';
/**
 * JSON-RPC request for `tevm_mine` method
 */
export type MineJsonRpcRequest = JsonRpcRequest<'tevm_mine', [blockCount: Hex, interval: Hex]>;
//# sourceMappingURL=MineJsonRpcRequest.d.ts.map