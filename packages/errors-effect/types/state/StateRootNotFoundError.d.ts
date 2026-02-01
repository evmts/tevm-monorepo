declare const StateRootNotFoundError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "StateRootNotFoundError";
} & Readonly<A>;
/**
 * @typedef {`0x${string}`} Hex
 */
/**
 * TaggedError representing a state root not found error.
 *
 * This error occurs when attempting to access state at a specific
 * state root that doesn't exist or is no longer available.
 *
 * @example
 * ```typescript
 * import { StateRootNotFoundError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new StateRootNotFoundError({
 *     stateRoot: '0x1234567890abcdef...'
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('StateRootNotFoundError', (error) => {
 *   console.log(`State root ${error.stateRoot} not found`)
 * })
 * ```
 */
export class StateRootNotFoundError extends StateRootNotFoundError_base {
    /**
     * JSON-RPC error code for invalid params (state root is a parameter).
     * @type {number}
     */
    static code: number;
    /**
     * Path to documentation for this error
     * @type {string}
     */
    static docsPath: string;
    /**
     * Constructs a new StateRootNotFoundError
     * @param {Object} props - Error properties
     * @param {Hex} [props.stateRoot] - The state root hash that was not found
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        stateRoot?: `0x${string}` | undefined;
        message?: string | undefined;
        cause?: unknown;
    });
    /**
     * The state root hash that was not found
     * @readonly
     * @type {Hex | undefined}
     */
    readonly stateRoot: Hex | undefined;
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
export type Hex = `0x${string}`;
export {};
//# sourceMappingURL=StateRootNotFoundError.d.ts.map