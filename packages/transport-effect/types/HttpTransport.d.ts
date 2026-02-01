export function HttpTransport(config: HttpTransportConfig): Layer.Layer<import("effect/Context").Tag<any, any>, never, never>;
export type TransportShape = import("./types.js").TransportShape;
export type HttpTransportConfig = import("./types.js").HttpTransportConfig;
export type BatchConfig = import("./types.js").BatchConfig;
/**
 * A pending batch request with its deferred result
 */
export type PendingRequest = {
    /**
     * - The JSON-RPC request id
     */
    id: number;
    /**
     * - The RPC method
     */
    method: string;
    /**
     * - The RPC params
     */
    params: unknown[];
    /**
     * - The deferred to resolve/reject
     */
    deferred: Deferred.Deferred<unknown, ForkError>;
};
import { Layer } from 'effect';
import { Deferred } from 'effect';
import { ForkError } from '@tevm/errors-effect';
//# sourceMappingURL=HttpTransport.d.ts.map