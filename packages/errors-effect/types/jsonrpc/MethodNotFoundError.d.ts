declare const MethodNotFoundError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "MethodNotFoundError";
} & Readonly<A>;
/**
 * TaggedError representing a method not found error.
 *
 * This error occurs when the requested JSON-RPC method does not exist
 * or is not available on the server.
 *
 * @example
 * ```typescript
 * import { MethodNotFoundError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new MethodNotFoundError({
 *     method: 'eth_unknownMethod'
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('MethodNotFoundError', (error) => {
 *   console.log(`Method not found: ${error.method}`)
 * })
 * ```
 */
export class MethodNotFoundError extends MethodNotFoundError_base {
    /**
     * JSON-RPC error code for method not found.
     * Standard JSON-RPC 2.0 error code: -32601
     * @type {number}
     */
    static code: number;
    /**
     * Path to documentation for this error
     * @type {string}
     */
    static docsPath: string;
    /**
     * Constructs a new MethodNotFoundError
     * @param {Object} props - Error properties
     * @param {string} [props.method] - The method that was not found
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        method?: string | undefined;
        message?: string | undefined;
        cause?: unknown;
    });
    /**
     * The method name that was not found
     * @readonly
     * @type {string | undefined}
     */
    readonly method: string | undefined;
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
//# sourceMappingURL=MethodNotFoundError.d.ts.map