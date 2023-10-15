import type { Log } from '../../types/log.js';
import type { RpcLog } from '../../types/rpc.js';
export declare function formatLog(log: Partial<RpcLog>, { args, eventName }?: {
    args?: unknown;
    eventName?: string;
}): Log;
//# sourceMappingURL=log.d.ts.map