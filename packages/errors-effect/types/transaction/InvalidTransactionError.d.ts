declare const InvalidTransactionError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "InvalidTransactionError";
} & Readonly<A>;
/**
 * TaggedError representing an invalid transaction error.
 *
 * This error occurs when a transaction doesn't conform to
 * the required format or validation rules.
 *
 * @example
 * ```typescript
 * import { InvalidTransactionError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new InvalidTransactionError({
 *     reason: 'Invalid nonce',
 *     tx: { to: '0x123...', value: 100n }
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('InvalidTransactionError', (error) => {
 *   console.log(`Invalid transaction: ${error.reason}`)
 * })
 * ```
 */
export class InvalidTransactionError extends InvalidTransactionError_base {
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
     * Constructs a new InvalidTransactionError
     * @param {Object} props - Error properties
     * @param {string} [props.reason] - The reason why the transaction is invalid
     * @param {unknown} [props.tx] - The invalid transaction object
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        reason?: string | undefined;
        tx?: unknown;
        message?: string | undefined;
        cause?: unknown;
    });
    /**
     * The reason why the transaction is invalid
     * @readonly
     * @type {string | undefined}
     */
    readonly reason: string | undefined;
    /**
     * The invalid transaction object
     * @readonly
     * @type {unknown}
     */
    readonly tx: unknown;
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
//# sourceMappingURL=InvalidTransactionError.d.ts.map