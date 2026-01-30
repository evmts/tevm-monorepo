declare const InsufficientBalanceError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "InsufficientBalanceError";
} & Readonly<A>;
/**
 * @typedef {`0x${string}`} Address
 */
/**
 * TaggedError representing insufficient balance during EVM execution.
 *
 * This error occurs when an account has insufficient balance to perform a transaction.
 *
 * @example
 * ```typescript
 * import { InsufficientBalanceError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new InsufficientBalanceError({
 *     address: '0x1234...',
 *     required: 1000000000000000000n,
 *     available: 500000000000000000n
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('InsufficientBalanceError', (error) => {
 *   console.log(`Account ${error.address} needs ${error.required} but has ${error.available}`)
 * })
 * ```
 */
export class InsufficientBalanceError extends InsufficientBalanceError_base {
    /**
     * JSON-RPC error code for insufficient balance.
     * Uses -32015 to match the original @tevm/errors ExecutionError code.
     * @type {number}
     */
    static code: number;
    /**
     * Path to documentation for this error
     * @type {string}
     */
    static docsPath: string;
    /**
     * Constructs a new InsufficientBalanceError
     * @param {Object} props - Error properties
     * @param {Address} [props.address] - The address with insufficient balance
     * @param {bigint} [props.required] - The required balance
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
     * The address that has insufficient balance
     * @readonly
     * @type {Address | undefined}
     */
    readonly address: Address | undefined;
    /**
     * The required balance to perform the operation
     * @readonly
     * @type {bigint | undefined}
     */
    readonly required: bigint | undefined;
    /**
     * The available balance in the account
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
     * Enables error chaining for better debugging.
     * @readonly
     * @type {unknown}
     */
    readonly cause: unknown;
}
export type Address = `0x${string}`;
export {};
//# sourceMappingURL=InsufficientBalanceError.d.ts.map