declare const NonceTooHighError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "NonceTooHighError";
} & Readonly<A>;
/**
 * @typedef {`0x${string}`} Address
 */
/**
 * TaggedError representing a nonce too high error.
 *
 * This error occurs when a transaction's nonce is higher than expected,
 * indicating there are missing transactions that need to be processed first.
 *
 * @example
 * ```typescript
 * import { NonceTooHighError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new NonceTooHighError({
 *     address: '0x1234567890123456789012345678901234567890',
 *     expected: 5n,
 *     actual: 10n
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('NonceTooHighError', (error) => {
 *   console.log(`Nonce too high for ${error.address}: expected ${error.expected}, got ${error.actual}`)
 * })
 * ```
 */
export class NonceTooHighError extends NonceTooHighError_base {
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
     * Constructs a new NonceTooHighError
     * @param {Object} props - Error properties
     * @param {Address} [props.address] - The account address
     * @param {bigint} [props.expected] - The expected nonce
     * @param {bigint} [props.actual] - The actual nonce provided
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        address?: `0x${string}` | undefined;
        expected?: bigint | undefined;
        actual?: bigint | undefined;
        message?: string | undefined;
        cause?: unknown;
    });
    /**
     * The address of the account
     * @readonly
     * @type {Address | undefined}
     */
    readonly address: Address | undefined;
    /**
     * The expected nonce value
     * @readonly
     * @type {bigint | undefined}
     */
    readonly expected: bigint | undefined;
    /**
     * The actual nonce value provided
     * @readonly
     * @type {bigint | undefined}
     */
    readonly actual: bigint | undefined;
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
export {};
//# sourceMappingURL=NonceTooHighError.d.ts.map