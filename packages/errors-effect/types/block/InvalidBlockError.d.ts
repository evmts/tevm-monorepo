declare const InvalidBlockError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "InvalidBlockError";
} & Readonly<A>;
/**
 * @typedef {`0x${string}`} Hex
 */
/**
 * TaggedError representing an invalid block error.
 *
 * This error occurs when a block fails validation, such as invalid header,
 * incorrect state root, or other block structure issues.
 *
 * @example
 * ```typescript
 * import { InvalidBlockError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new InvalidBlockError({
 *     blockNumber: 12345n,
 *     reason: 'Invalid state root'
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('InvalidBlockError', (error) => {
 *   console.log(`Invalid block ${error.blockNumber}: ${error.reason}`)
 * })
 * ```
 */
export class InvalidBlockError extends InvalidBlockError_base {
    /**
     * JSON-RPC error code for invalid block.
     * @type {number}
     */
    static code: number;
    /**
     * Path to documentation for this error
     * @type {string}
     */
    static docsPath: string;
    /**
     * Constructs a new InvalidBlockError
     * @param {Object} props - Error properties
     * @param {bigint} [props.blockNumber] - The block number
     * @param {Hex} [props.blockHash] - The block hash
     * @param {string} [props.reason] - The reason for invalidity
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        blockNumber?: bigint | undefined;
        blockHash?: `0x${string}` | undefined;
        reason?: string | undefined;
        message?: string | undefined;
        cause?: unknown;
    });
    /**
     * The block number that is invalid
     * @readonly
     * @type {bigint | undefined}
     */
    readonly blockNumber: bigint | undefined;
    /**
     * The block hash that is invalid
     * @readonly
     * @type {Hex | undefined}
     */
    readonly blockHash: Hex | undefined;
    /**
     * The reason why the block is invalid
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
     * @readonly
     * @type {unknown}
     */
    readonly cause: unknown;
}
export type Hex = `0x${string}`;
export {};
//# sourceMappingURL=InvalidBlockError.d.ts.map