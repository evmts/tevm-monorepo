declare const AccountNotFoundError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "AccountNotFoundError";
} & Readonly<A>;
/**
 * @typedef {`0x${string}`} Address
 */
/**
 * TaggedError representing an account not found error.
 *
 * This error occurs when attempting to access an account that does not exist
 * in the state, typically in non-forking mode or when the account hasn't been created.
 *
 * @example
 * ```typescript
 * import { AccountNotFoundError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new AccountNotFoundError({
 *     address: '0x1234567890123456789012345678901234567890'
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('AccountNotFoundError', (error) => {
 *   console.log(`Account not found: ${error.address}`)
 * })
 * ```
 */
export class AccountNotFoundError extends AccountNotFoundError_base {
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
     * Constructs a new AccountNotFoundError
     * @param {Object} props - Error properties
     * @param {Address} [props.address] - The address that was not found
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        address?: `0x${string}` | undefined;
        message?: string | undefined;
        cause?: unknown;
    });
    /**
     * The address of the account that was not found
     * @readonly
     * @type {Address | undefined}
     */
    readonly address: Address | undefined;
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
//# sourceMappingURL=AccountNotFoundError.d.ts.map