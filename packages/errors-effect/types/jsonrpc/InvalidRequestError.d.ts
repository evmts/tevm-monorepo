declare const InvalidRequestError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "InvalidRequestError";
} & Readonly<A>;
/**
 * TaggedError representing an invalid JSON-RPC request.
 *
 * This error occurs when the JSON-RPC request object is invalid,
 * such as missing required fields or malformed structure.
 *
 * @example
 * ```typescript
 * import { InvalidRequestError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new InvalidRequestError({
 *     message: 'Missing "method" field in request'
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('InvalidRequestError', (error) => {
 *   console.log(`Invalid request: ${error.message}`)
 * })
 * ```
 */
export class InvalidRequestError extends InvalidRequestError_base {
    /**
     * JSON-RPC error code for invalid request.
     * Standard JSON-RPC 2.0 error code: -32600
     * @type {number}
     */
    static code: number;
    /**
     * Path to documentation for this error
     * @type {string}
     */
    static docsPath: string;
    /**
     * Constructs a new InvalidRequestError
     * @param {Object} props - Error properties
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        message?: string | undefined;
        cause?: unknown;
    });
    /**
     * Human-readable error message
     * @override
     * @readonly
     * @type {string}
     */
    override readonly message: string;
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
     * @override
     * @readonly
     * @type {unknown}
     */
    override readonly cause: unknown;
}
export {};
//# sourceMappingURL=InvalidRequestError.d.ts.map