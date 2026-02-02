declare const InvalidOpcodeError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "InvalidOpcodeError";
} & Readonly<A>;
/**
 * TaggedError representing an invalid opcode error during EVM execution.
 *
 * This error occurs when the EVM encounters an invalid or undefined opcode.
 *
 * @example
 * ```typescript
 * import { InvalidOpcodeError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new InvalidOpcodeError({
 *     opcode: 0xfe
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('InvalidOpcodeError', (error) => {
 *   console.log(`Invalid opcode: ${error.opcode}`)
 * })
 * ```
 */
export class InvalidOpcodeError extends InvalidOpcodeError_base {
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
     * Constructs a new InvalidOpcodeError
     * @param {Object} props - Error properties
     * @param {number} [props.opcode] - The invalid opcode
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        opcode?: number | undefined;
        message?: string | undefined;
        cause?: unknown;
    });
    /**
     * The invalid opcode that was encountered
     * @readonly
     * @type {number | undefined}
     */
    readonly opcode: number | undefined;
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
//# sourceMappingURL=InvalidOpcodeError.d.ts.map