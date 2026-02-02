declare const OutOfGasError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "OutOfGasError";
} & Readonly<A>;
/**
 * TaggedError representing an out of gas error during EVM execution.
 *
 * This error occurs when a transaction runs out of gas during execution.
 *
 * @example
 * ```typescript
 * import { OutOfGasError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new OutOfGasError({
 *     gasUsed: 100000n,
 *     gasLimit: 21000n
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('OutOfGasError', (error) => {
 *   console.log(`Gas used: ${error.gasUsed}, limit was: ${error.gasLimit}`)
 * })
 * ```
 */
export class OutOfGasError extends OutOfGasError_base {
    /**
     * JSON-RPC error code for gas limit exceeded
     * @type {number}
     */
    static code: number;
    /**
     * Path to documentation for this error
     * @type {string}
     */
    static docsPath: string;
    /**
     * Constructs a new OutOfGasError
     * @param {Object} props - Error properties
     * @param {bigint} [props.gasUsed] - The gas used when the error occurred
     * @param {bigint} [props.gasLimit] - The gas limit for the transaction
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        gasUsed?: bigint | undefined;
        gasLimit?: bigint | undefined;
        message?: string | undefined;
        cause?: unknown;
    });
    /**
     * The gas used when the error occurred
     * @readonly
     * @type {bigint | undefined}
     */
    readonly gasUsed: bigint | undefined;
    /**
     * The gas limit for the transaction
     * @readonly
     * @type {bigint | undefined}
     */
    readonly gasLimit: bigint | undefined;
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
     * Enables error chaining for better debugging.
     * @override
     * @readonly
     * @type {unknown}
     */
    override readonly cause: unknown;
}
export {};
//# sourceMappingURL=OutOfGasError.d.ts.map