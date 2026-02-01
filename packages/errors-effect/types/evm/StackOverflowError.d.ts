declare const StackOverflowError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "StackOverflowError";
} & Readonly<A>;
/**
 * TaggedError representing a stack overflow error during EVM execution.
 *
 * This error occurs when the EVM stack exceeds its maximum depth (1024).
 *
 * @example
 * ```typescript
 * import { StackOverflowError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new StackOverflowError({
 *     stackSize: 1025
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('StackOverflowError', (error) => {
 *   console.log(`Stack overflow: ${error.stackSize} items`)
 * })
 * ```
 */
export class StackOverflowError extends StackOverflowError_base {
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
     * Constructs a new StackOverflowError
     * @param {Object} props - Error properties
     * @param {number} [props.stackSize] - The stack size when overflow occurred
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        stackSize?: number | undefined;
        message?: string | undefined;
        cause?: unknown;
    });
    /**
     * The stack size when overflow occurred
     * @readonly
     * @type {number | undefined}
     */
    readonly stackSize: number | undefined;
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
     * Enables error chaining for better debugging.
     * @override
     * @readonly
     * @type {unknown}
     */
    override readonly cause: unknown;
}
export {};
//# sourceMappingURL=StackOverflowError.d.ts.map