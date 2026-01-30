declare const FilterNotFoundError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "FilterNotFoundError";
} & Readonly<A>;
/**
 * @typedef {`0x${string}`} Hex
 */
/**
 * TaggedError representing a filter not found error.
 *
 * This error occurs when attempting to use a filter that does not exist,
 * typically because it was never created, has expired, or was removed.
 *
 * @example
 * ```typescript
 * import { FilterNotFoundError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new FilterNotFoundError({
 *     filterId: '0xabc123'
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('FilterNotFoundError', (error) => {
 *   console.log(`Filter not found: ${error.filterId}`)
 * })
 * ```
 */
export class FilterNotFoundError extends FilterNotFoundError_base {
    /**
     * JSON-RPC error code for resource not found.
     * @type {number}
     */
    static code: number;
    /**
     * Path to documentation for this error
     * @type {string}
     */
    static docsPath: string;
    /**
     * Constructs a new FilterNotFoundError
     * @param {Object} props - Error properties
     * @param {Hex | string} [props.filterId] - The filter ID that was not found
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        filterId?: string | undefined;
        message?: string | undefined;
        cause?: unknown;
    });
    /**
     * The filter ID that was not found
     * @readonly
     * @type {Hex | string | undefined}
     */
    readonly filterId: Hex | string | undefined;
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
//# sourceMappingURL=FilterNotFoundError.d.ts.map