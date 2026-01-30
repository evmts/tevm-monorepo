declare const StackUnderflowError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "StackUnderflowError";
} & Readonly<A>;
/**
 * TaggedError representing a stack underflow error during EVM execution.
 *
 * This error occurs when an operation tries to pop more items from the stack
 * than are available.
 *
 * @example
 * ```typescript
 * import { StackUnderflowError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new StackUnderflowError({
 *     requiredItems: 2,
 *     availableItems: 1
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('StackUnderflowError', (error) => {
 *   console.log(`Stack underflow: needed ${error.requiredItems}, had ${error.availableItems}`)
 * })
 * ```
 */
export class StackUnderflowError extends StackUnderflowError_base {
    /**
     * JSON-RPC error code for execution error
     * @type {number}
     */
    static code: number;
    /**
     * Path to documentation for this error
     * @type {string}
     */
    static docsPath: string;
    /**
     * Constructs a new StackUnderflowError
     * @param {Object} props - Error properties
     * @param {number} [props.requiredItems] - The number of stack items required by the operation
     * @param {number} [props.availableItems] - The number of stack items available
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        requiredItems?: number | undefined;
        availableItems?: number | undefined;
        message?: string | undefined;
        cause?: unknown;
    });
    /**
     * The number of stack items required by the operation
     * @readonly
     * @type {number | undefined}
     */
    readonly requiredItems: number | undefined;
    /**
     * The number of stack items available when underflow occurred
     * @readonly
     * @type {number | undefined}
     */
    readonly availableItems: number | undefined;
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
export {};
//# sourceMappingURL=StackUnderflowError.d.ts.map