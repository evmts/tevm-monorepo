declare const InvalidFilterTypeError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "InvalidFilterTypeError";
} & Readonly<A>;
/**
 * @typedef {`0x${string}`} Hex
 */
/**
 * TaggedError representing an invalid filter type error.
 *
 * This error occurs when attempting to use a filter with an operation that
 * requires a different filter type. For example, trying to get log changes
 * from a block filter, or block changes from a pending transaction filter.
 *
 * @example
 * ```typescript
 * import { InvalidFilterTypeError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new InvalidFilterTypeError({
 *     filterId: '0xabc123',
 *     expectedType: 'Log',
 *     actualType: 'Block'
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('InvalidFilterTypeError', (error) => {
 *   console.log(`Filter ${error.filterId} is ${error.actualType}, expected ${error.expectedType}`)
 * })
 * ```
 */
export class InvalidFilterTypeError extends InvalidFilterTypeError_base {
    /**
     * JSON-RPC error code for invalid params.
     * @type {number}
     */
    static code: number;
    /**
     * Path to documentation for this error
     * @type {string}
     */
    static docsPath: string;
    /**
     * Constructs a new InvalidFilterTypeError
     * @param {Object} props - Error properties
     * @param {Hex | string} [props.filterId] - The filter ID that had the wrong type
     * @param {string} [props.expectedType] - The expected filter type (e.g., 'Log', 'Block', 'PendingTransaction')
     * @param {string} [props.actualType] - The actual filter type
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        filterId?: string | undefined;
        expectedType?: string | undefined;
        actualType?: string | undefined;
        message?: string | undefined;
        cause?: unknown;
    });
    /**
     * The filter ID that had the wrong type
     * @readonly
     * @type {Hex | string | undefined}
     */
    readonly filterId: Hex | string | undefined;
    /**
     * The expected filter type
     * @readonly
     * @type {string | undefined}
     */
    readonly expectedType: string | undefined;
    /**
     * The actual filter type
     * @readonly
     * @type {string | undefined}
     */
    readonly actualType: string | undefined;
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
export type Hex = `0x${string}`;
export {};
//# sourceMappingURL=InvalidFilterTypeError.d.ts.map