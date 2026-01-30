declare const InternalError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "InternalError";
} & Readonly<A>;
/**
 * TaggedError representing an internal JSON-RPC error.
 *
 * This error occurs when an internal error is encountered while processing
 * a JSON-RPC request, typically indicating a server-side issue.
 *
 * @example
 * ```typescript
 * import { InternalError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new InternalError({
 *     message: 'Database connection failed',
 *     meta: { database: 'state-db', retries: 3 }
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('InternalError', (error) => {
 *   console.log(`Internal error: ${error.message}`)
 *   if (error.meta) console.log('Meta:', error.meta)
 * })
 * ```
 */
export class InternalError extends InternalError_base {
    /**
     * JSON-RPC error code for internal error.
     * Standard JSON-RPC 2.0 error code: -32603
     * @type {number}
     */
    static code: number;
    /**
     * Path to documentation for this error
     * @type {string}
     */
    static docsPath: string;
    /**
     * Constructs a new InternalError
     * @param {Object} props - Error properties
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.meta] - Additional metadata
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        message?: string | undefined;
        meta?: unknown;
        cause?: unknown;
    });
    /**
     * Additional metadata about the error
     * @readonly
     * @type {unknown}
     */
    readonly meta: unknown;
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
//# sourceMappingURL=InternalError.d.ts.map