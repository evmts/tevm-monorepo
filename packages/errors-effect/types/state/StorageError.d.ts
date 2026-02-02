declare const StorageError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "StorageError";
} & Readonly<A>;
/**
 * @typedef {`0x${string}`} Address
 * @typedef {`0x${string}`} Hex
 */
/**
 * TaggedError representing a storage access error.
 *
 * This error occurs when there's an issue accessing or modifying contract storage,
 * such as invalid storage keys, permission issues, or internal state errors.
 *
 * @example
 * ```typescript
 * import { StorageError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new StorageError({
 *     address: '0x1234567890123456789012345678901234567890',
 *     key: '0x0000000000000000000000000000000000000000000000000000000000000001'
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('StorageError', (error) => {
 *   console.log(`Storage error for ${error.address} at key ${error.key}`)
 * })
 * ```
 */
export class StorageError extends StorageError_base {
    /**
     * JSON-RPC error code for internal error.
     * @type {number}
     */
    static code: number;
    /**
     * Path to documentation for this error
     * @type {string}
     */
    static docsPath: string;
    /**
     * Constructs a new StorageError
     * @param {Object} props - Error properties
     * @param {Address} [props.address] - The contract address
     * @param {Hex} [props.key] - The storage key
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        address?: `0x${string}` | undefined;
        key?: `0x${string}` | undefined;
        message?: string | undefined;
        cause?: unknown;
    });
    /**
     * The contract address where the storage error occurred
     * @readonly
     * @type {Address | undefined}
     */
    readonly address: Address | undefined;
    /**
     * The storage key that caused the error
     * @readonly
     * @type {Hex | undefined}
     */
    readonly key: Hex | undefined;
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
export type Address = `0x${string}`;
export type Hex = `0x${string}`;
export {};
//# sourceMappingURL=StorageError.d.ts.map