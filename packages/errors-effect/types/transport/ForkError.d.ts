declare const ForkError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "ForkError";
} & Readonly<A>;
/**
 * TaggedError representing a fork transport error.
 *
 * This error occurs when attempting to fetch a resource from a forked transport
 * fails, such as network issues, timeouts, or JSON-RPC errors.
 *
 * @example
 * ```typescript
 * import { ForkError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new ForkError({
 *     method: 'eth_getBalance',
 *     cause: new Error('Network timeout')
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('ForkError', (error) => {
 *   console.log(`Fork request failed for ${error.method}: ${error.cause}`)
 * })
 * ```
 */
export class ForkError extends ForkError_base {
    /**
     * JSON-RPC error code for fork errors.
     * Uses -32604 (resource not found) as default.
     * @type {number}
     */
    static code: number;
    /**
     * Path to documentation for this error
     * @type {string}
     */
    static docsPath: string;
    /**
     * Constructs a new ForkError
     * @param {Object} props - Error properties
     * @param {string} [props.method] - The JSON-RPC method that failed
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        method?: string | undefined;
        message?: string | undefined;
        cause?: unknown;
    });
    /**
     * The JSON-RPC method that was being called when the error occurred
     * @readonly
     * @type {string | undefined}
     */
    readonly method: string | undefined;
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
     * The underlying cause of this error.
     * Typically contains the original JSON-RPC error or network error.
     * @readonly
     * @type {unknown}
     */
    readonly cause: unknown;
}
export {};
//# sourceMappingURL=ForkError.d.ts.map