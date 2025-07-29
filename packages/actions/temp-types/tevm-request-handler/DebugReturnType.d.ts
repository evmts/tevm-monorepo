import type { DebugTraceBlockJsonRpcResponse, DebugTraceCallJsonRpcResponse, DebugTraceStateJsonRpcResponse, DebugTraceTransactionJsonRpcResponse } from '../debug/DebugJsonRpcResponse.js';
/**
 * A mapping of `debug_*` method names to their return type
 */
export type DebugReturnType = {
    debug_traceTransaction: DebugTraceTransactionJsonRpcResponse;
    debug_traceCall: DebugTraceCallJsonRpcResponse;
    debug_traceBlock: DebugTraceBlockJsonRpcResponse;
    debug_traceState: DebugTraceStateJsonRpcResponse;
};
//# sourceMappingURL=DebugReturnType.d.ts.map