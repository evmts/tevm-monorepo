import type { MineJsonRpcRequest, MineJsonRpcResponse } from '../index.js'

/**
 * Mine JSON-RPC tevm procedure mines 1 or more blocks
 */
export type MineJsonRpcProcedure = (request: MineJsonRpcRequest) => Promise<MineJsonRpcResponse>
