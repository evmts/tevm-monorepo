declare const BlockGasLimitExceededError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "BlockGasLimitExceededError";
} & Readonly<A>;
/**
 * TaggedError representing a block gas limit exceeded error.
 *
 * This error occurs when a transaction or set of transactions exceeds
 * the block's gas limit.
 *
 * @example
 * ```typescript
 * import { BlockGasLimitExceededError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new BlockGasLimitExceededError({
 *     blockGasLimit: 30000000n,
 *     gasUsed: 35000000n
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('BlockGasLimitExceededError', (error) => {
 *   console.log(`Block gas limit exceeded: used ${error.gasUsed} of ${error.blockGasLimit}`)
 * })
 * ```
 */
export class BlockGasLimitExceededError extends BlockGasLimitExceededError_base {
    /**
     * JSON-RPC error code for gas limit exceeded.
     * @type {number}
     */
    static code: number;
    /**
     * Path to documentation for this error
     * @type {string}
     */
    static docsPath: string;
    /**
     * Constructs a new BlockGasLimitExceededError
     * @param {Object} props - Error properties
     * @param {bigint} [props.blockGasLimit] - The block's gas limit
     * @param {bigint} [props.gasUsed] - The gas used or required
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        blockGasLimit?: bigint | undefined;
        gasUsed?: bigint | undefined;
        message?: string | undefined;
        cause?: unknown;
    });
    /**
     * The block's gas limit
     * @readonly
     * @type {bigint | undefined}
     */
    readonly blockGasLimit: bigint | undefined;
    /**
     * The gas used or required
     * @readonly
     * @type {bigint | undefined}
     */
    readonly gasUsed: bigint | undefined;
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
//# sourceMappingURL=BlockGasLimitExceededError.d.ts.map