/**
 * @module @tevm/transport-effect/types
 * @description Type definitions for the transport-effect package
 */

/**
 * Ethereum hex string type (0x prefixed)
 * @typedef {`0x${string}`} Hex
 */

/**
 * Batch request configuration for HTTP transport
 * @typedef {Object} BatchConfig
 * @property {number} wait - Milliseconds to wait before sending batch (allows requests to accumulate)
 * @property {number} maxSize - Maximum number of requests per batch
 */

/**
 * Transport configuration for HTTP-based transport
 * @typedef {Object} HttpTransportConfig
 * @property {string} url - The RPC endpoint URL
 * @property {number} [timeout] - Request timeout in milliseconds (default: 30000)
 * @property {number} [retryCount] - Number of retry attempts (default: 3)
 * @property {number} [retryDelay] - Base delay between retries in ms (default: 1000)
 * @property {Record<string, string>} [headers] - Custom HTTP headers
 * @property {BatchConfig} [batch] - Batch configuration for combining multiple requests
 */

/**
 * Fork configuration shape containing chain ID and block tag
 * @typedef {Object} ForkConfigShape
 * @property {bigint} chainId - The chain ID of the forked network
 * @property {bigint} blockTag - The block number to fork from
 */

/**
 * Transport shape interface for making RPC requests
 * @typedef {Object} TransportShape
 * @property {<T>(method: string, params?: unknown[]) => import('effect').Effect.Effect<T, import('@tevm/errors-effect').ForkError>} request - Make an RPC request
 */

export {}
