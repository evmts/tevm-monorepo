/**
 * Ethereum hex string type (0x prefixed)
 */
export type Hex = `0x${string}`;
/**
 * Batch request configuration for HTTP transport
 */
export type BatchConfig = {
    /**
     * - Milliseconds to wait before sending batch (allows requests to accumulate)
     */
    wait: number;
    /**
     * - Maximum number of requests per batch
     */
    maxSize: number;
};
/**
 * Transport configuration for HTTP-based transport
 */
export type HttpTransportConfig = {
    /**
     * - The RPC endpoint URL
     */
    url: string;
    /**
     * - Request timeout in milliseconds (default: 30000)
     */
    timeout?: number;
    /**
     * - Number of retry attempts (default: 3)
     */
    retryCount?: number;
    /**
     * - Base delay between retries in ms (default: 1000)
     */
    retryDelay?: number;
    /**
     * - Custom HTTP headers
     */
    headers?: Record<string, string>;
    /**
     * - Batch configuration for combining multiple requests
     */
    batch?: BatchConfig;
};
/**
 * Fork configuration shape containing chain ID and block tag
 */
export type ForkConfigShape = {
    /**
     * - The chain ID of the forked network
     */
    chainId: bigint;
    /**
     * - The block number to fork from
     */
    blockTag: bigint;
};
/**
 * Transport shape interface for making RPC requests
 */
export type TransportShape = {
    /**
     * - Make an RPC request
     */
    request: <T>(method: string, params?: unknown[]) => import("effect").Effect.Effect<T, import("@tevm/errors-effect").ForkError>;
};
//# sourceMappingURL=types.d.ts.map