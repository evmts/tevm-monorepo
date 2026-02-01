declare const InvalidParamsError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "InvalidParamsError";
} & Readonly<A>;
/**
 * TaggedError representing invalid JSON-RPC parameters.
 *
 * This error occurs when the parameters provided to a JSON-RPC method
 * are invalid, such as wrong types, missing required params, or invalid values.
 *
 * @example
 * ```typescript
 * import { InvalidParamsError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new InvalidParamsError({
 *     method: 'eth_getBalance',
 *     params: ['invalid-address', 'latest']
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('InvalidParamsError', (error) => {
 *   console.log(`Invalid params for ${error.method}: ${error.message}`)
 * })
 * ```
 */
export class InvalidParamsError extends InvalidParamsError_base {
    /**
     * JSON-RPC error code for invalid params.
     * Standard JSON-RPC 2.0 error code: -32602
     * @type {number}
     */
    static code: number;
    /**
     * Path to documentation for this error
     * @type {string}
     */
    static docsPath: string;
    /**
     * Constructs a new InvalidParamsError
     * @param {Object} props - Error properties
     * @param {string} [props.method] - The method that received invalid params
     * @param {unknown} [props.params] - The invalid parameters
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        method?: string | undefined;
        params?: unknown;
        message?: string | undefined;
        cause?: unknown;
    });
    /**
     * The method that received invalid parameters
     * @readonly
     * @type {string | undefined}
     */
    readonly method: string | undefined;
    /**
     * The invalid parameters that were provided
     * @readonly
     * @type {unknown}
     */
    readonly params: unknown;
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
//# sourceMappingURL=InvalidParamsError.d.ts.map