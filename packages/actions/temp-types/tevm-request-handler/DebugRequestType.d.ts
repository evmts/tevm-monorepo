import type { DebugTraceBlockJsonRpcRequest, DebugTraceCallJsonRpcRequest, DebugTraceStateJsonRpcRequest, DebugTraceTransactionJsonRpcRequest } from '../debug/DebugJsonRpcRequest.js';
/**
 * A mapping of `debug_*` method names to their request type
 */
export type DebugRequestType = {
    debug_traceTransaction: DebugTraceTransactionJsonRpcRequest;
    debug_traceCall: DebugTraceCallJsonRpcRequest;
    debug_traceBlock: DebugTraceBlockJsonRpcRequest;
    debug_traceState: DebugTraceStateJsonRpcRequest;
};
//# sourceMappingURL=DebugRequestType.d.ts.map