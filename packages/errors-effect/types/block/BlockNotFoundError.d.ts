declare const BlockNotFoundError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "BlockNotFoundError";
} & Readonly<A>;
/**
 * @typedef {`0x${string}` | 'latest' | 'pending' | 'earliest' | 'safe' | 'finalized' | bigint | number} BlockTag
 */
/**
 * TaggedError representing a block not found error.
 *
 * This error occurs when a specified block could not be found,
 * either by block number, hash, or tag.
 *
 * @example
 * ```typescript
 * import { BlockNotFoundError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new BlockNotFoundError({
 *     blockTag: 'latest'
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('BlockNotFoundError', (error) => {
 *   console.log(`Block ${error.blockTag} not found`)
 * })
 * ```
 */
export class BlockNotFoundError extends BlockNotFoundError_base {
    /**
     * JSON-RPC error code for unknown block.
     * @type {number}
     */
    static code: number;
    /**
     * Path to documentation for this error
     * @type {string}
     */
    static docsPath: string;
    /**
     * Constructs a new BlockNotFoundError
     * @param {Object} props - Error properties
     * @param {BlockTag} [props.blockTag] - The block tag, number, or hash that was not found
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        blockTag?: BlockTag | undefined;
        message?: string | undefined;
        cause?: unknown;
    });
    /**
     * The block tag, number, or hash that was not found
     * @readonly
     * @type {BlockTag | undefined}
     */
    readonly blockTag: BlockTag | undefined;
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
export type BlockTag = `0x${string}` | "latest" | "pending" | "earliest" | "safe" | "finalized" | bigint | number;
export {};
//# sourceMappingURL=BlockNotFoundError.d.ts.map