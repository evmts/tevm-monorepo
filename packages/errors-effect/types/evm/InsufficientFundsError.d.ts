declare const InsufficientFundsError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "InsufficientFundsError";
} & Readonly<A>;
/**
 * @typedef {`0x${string}`} Address
 */
/**
 * TaggedError representing insufficient funds for gas * price + value.
 *
 * This error occurs when the sender account doesn't have enough balance
 * to cover the transaction's gas fees plus the value being sent.
 * This is different from InsufficientBalanceError which is about contract execution.
 *
 * @example
 * ```typescript
 * import { InsufficientFundsError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new InsufficientFundsError({
 *     address: '0x1234567890123456789012345678901234567890',
 *     required: 1000000000000000000n,
 *     available: 500000000000000000n
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('InsufficientFundsError', (error) => {
 *   console.log(`Insufficient funds for ${error.address}: need ${error.required}, have ${error.available}`)
 * })
 * ```
 */
export class InsufficientFundsError extends InsufficientFundsError_base {
    /**
     * JSON-RPC error code for insufficient funds.
     * @type {number}
     */
    static code: number;
    /**
     * Path to documentation for this error
     * @type {string}
     */
    static docsPath: string;
    /**
     * Constructs a new InsufficientFundsError
     * @param {Object} props - Error properties
     * @param {Address} [props.address] - The account address
     * @param {bigint} [props.required] - The total required balance
     * @param {bigint} [props.available] - The available balance
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        address?: `0x${string}` | undefined;
        required?: bigint | undefined;
        available?: bigint | undefined;
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
     * The total required balance (gas * price + value)
     * @readonly
     * @type {bigint | undefined}
     */
    readonly required: bigint | undefined;
    /**
     * The available balance
     * @readonly
     * @type {bigint | undefined}
     */
    readonly available: bigint | undefined;
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
export type Address = `0x${string}`;
export {};
//# sourceMappingURL=InsufficientFundsError.d.ts.map