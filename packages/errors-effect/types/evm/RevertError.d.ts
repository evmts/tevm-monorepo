declare const RevertError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "RevertError";
} & Readonly<A>;
/**
 * @typedef {`0x${string}`} Hex
 */
/**
 * TaggedError representing a revert during EVM execution.
 *
 * This error occurs when a transaction or call explicitly reverts.
 *
 * @example
 * ```typescript
 * import { RevertError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new RevertError({
 *     raw: '0x08c379a0...',
 *     reason: 'Insufficient allowance'
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('RevertError', (error) => {
 *   console.log(`Reverted: ${error.reason}`)
 * })
 * ```
 */
export class RevertError extends RevertError_base {
    /**
     * JSON-RPC error code for execution reverted
     * @type {number}
     */
    static code: number;
    /**
     * Path to documentation for this error
     * @type {string}
     */
    static docsPath: string;
    /**
     * Constructs a new RevertError
     * @param {Object} props - Error properties
     * @param {Hex} [props.raw] - The raw revert data (encoded error)
     * @param {string} [props.reason] - The decoded revert reason
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        raw?: `0x${string}` | undefined;
        reason?: string | undefined;
        message?: string | undefined;
        cause?: unknown;
    });
    /**
     * The raw revert data (encoded error).
     * Named 'raw' to match the original @tevm/errors RevertError property.
     * @readonly
     * @type {Hex | undefined}
     */
    readonly raw: Hex | undefined;
    /**
     * The decoded revert reason, if available
     * @readonly
     * @type {string | undefined}
     */
    readonly reason: string | undefined;
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
     * Enables error chaining for better debugging.
     * @readonly
     * @type {unknown}
     */
    readonly cause: unknown;
}
export type Hex = `0x${string}`;
export {};
//# sourceMappingURL=RevertError.d.ts.map