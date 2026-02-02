declare const SnapshotNotFoundError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "SnapshotNotFoundError";
} & Readonly<A>;
/**
 * TaggedError representing a snapshot not found error.
 *
 * This error occurs when attempting to revert to a snapshot that does not exist,
 * typically because it was never created or has been garbage collected.
 *
 * @example
 * ```typescript
 * import { SnapshotNotFoundError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new SnapshotNotFoundError({
 *     snapshotId: '0x1234567890abcdef'
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('SnapshotNotFoundError', (error) => {
 *   console.log(`Snapshot not found: ${error.snapshotId}`)
 * })
 * ```
 */
export class SnapshotNotFoundError extends SnapshotNotFoundError_base {
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
     * Constructs a new SnapshotNotFoundError
     * @param {Object} props - Error properties
     * @param {`0x${string}` | string} [props.snapshotId] - The snapshot ID that was not found
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        snapshotId?: string | undefined;
        message?: string | undefined;
        cause?: unknown;
    });
    /**
     * The snapshot ID that was not found
     * @readonly
     * @type {`0x${string}` | string | undefined}
     */
    readonly snapshotId: `0x${string}` | string | undefined;
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
//# sourceMappingURL=SnapshotNotFoundError.d.ts.map