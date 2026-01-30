declare const NetworkError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "NetworkError";
} & Readonly<A>;
/**
 * TaggedError representing a network error.
 *
 * This error occurs when a network request fails, such as connection refused,
 * DNS resolution failure, or other network-level issues.
 *
 * @example
 * ```typescript
 * import { NetworkError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new NetworkError({
 *     url: 'https://mainnet.infura.io/v3/...',
 *     cause: new Error('Connection refused')
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('NetworkError', (error) => {
 *   console.log(`Network error for ${error.url}: ${error.message}`)
 * })
 * ```
 */
export class NetworkError extends NetworkError_base {
    /**
     * JSON-RPC error code for network errors.
     * @type {number}
     */
    static code: number;
    /**
     * Path to documentation for this error
     * @type {string}
     */
    static docsPath: string;
    /**
     * Constructs a new NetworkError
     * @param {Object} props - Error properties
     * @param {string} [props.url] - The URL that failed
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        url?: string | undefined;
        message?: string | undefined;
        cause?: unknown;
    });
    /**
     * The URL that was being requested
     * @readonly
     * @type {string | undefined}
     */
    readonly url: string | undefined;
    /**
     * Human-readable error message
     * @readonly
     * @type {string}
     */
    readonly message: string;
    /**
     * JSON-RPC error code
     * @readonly
     * @type {number}
     */
    readonly code: number;
    /**
     * Path to documentation
     * @readonly
     * @type {string}
     */
    readonly docsPath: string;
    /**
     * The underlying cause of this error, if any.
     * @readonly
     * @type {unknown}
     */
    readonly cause: unknown;
}
export {};
//# sourceMappingURL=NetworkError.d.ts.map