declare const TimeoutError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "TimeoutError";
} & Readonly<A>;
/**
 * TaggedError representing a timeout error.
 *
 * This error occurs when a request exceeds the configured timeout duration,
 * typically during network requests or long-running operations.
 *
 * @example
 * ```typescript
 * import { TimeoutError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new TimeoutError({
 *     timeout: 30000,
 *     operation: 'eth_call'
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('TimeoutError', (error) => {
 *   console.log(`Operation '${error.operation}' timed out after ${error.timeout}ms`)
 * })
 * ```
 */
export class TimeoutError extends TimeoutError_base {
    /**
     * JSON-RPC error code for timeout.
     * @type {number}
     */
    static code: number;
    /**
     * Path to documentation for this error
     * @type {string}
     */
    static docsPath: string;
    /**
     * Constructs a new TimeoutError
     * @param {Object} props - Error properties
     * @param {number} [props.timeout] - The timeout duration in milliseconds
     * @param {string} [props.operation] - The operation that timed out
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        timeout?: number | undefined;
        operation?: string | undefined;
        message?: string | undefined;
        cause?: unknown;
    });
    /**
     * The timeout duration in milliseconds
     * @readonly
     * @type {number | undefined}
     */
    readonly timeout: number | undefined;
    /**
     * The operation that timed out
     * @readonly
     * @type {string | undefined}
     */
    readonly operation: string | undefined;
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
//# sourceMappingURL=TimeoutError.d.ts.map