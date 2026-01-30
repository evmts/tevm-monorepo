declare const GasTooLowError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "GasTooLowError";
} & Readonly<A>;
/**
 * TaggedError representing a gas too low error.
 *
 * This error occurs when the gas limit provided for a transaction is insufficient
 * to cover the intrinsic gas cost of the transaction.
 *
 * @example
 * ```typescript
 * import { GasTooLowError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new GasTooLowError({
 *     gasLimit: 21000n,
 *     intrinsicGas: 53000n
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('GasTooLowError', (error) => {
 *   console.log(`Gas too low: provided ${error.gasLimit}, need ${error.intrinsicGas}`)
 * })
 * ```
 */
export class GasTooLowError extends GasTooLowError_base {
    /**
     * JSON-RPC error code for invalid transaction.
     * @type {number}
     */
    static code: number;
    /**
     * Path to documentation for this error
     * @type {string}
     */
    static docsPath: string;
    /**
     * Constructs a new GasTooLowError
     * @param {Object} props - Error properties
     * @param {bigint} [props.gasLimit] - The gas limit provided
     * @param {bigint} [props.intrinsicGas] - The minimum gas required
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        gasLimit?: bigint | undefined;
        intrinsicGas?: bigint | undefined;
        message?: string | undefined;
        cause?: unknown;
    });
    /**
     * The gas limit provided in the transaction
     * @readonly
     * @type {bigint | undefined}
     */
    readonly gasLimit: bigint | undefined;
    /**
     * The minimum intrinsic gas required
     * @readonly
     * @type {bigint | undefined}
     */
    readonly intrinsicGas: bigint | undefined;
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
//# sourceMappingURL=GasTooLowError.d.ts.map