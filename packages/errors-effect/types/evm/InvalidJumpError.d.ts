declare const InvalidJumpError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "InvalidJumpError";
} & Readonly<A>;
/**
 * TaggedError representing an invalid jump destination error.
 *
 * This error occurs during EVM execution when a JUMP or JUMPI instruction
 * attempts to jump to an invalid destination (not a JUMPDEST opcode).
 *
 * @example
 * ```typescript
 * import { InvalidJumpError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new InvalidJumpError({
 *     destination: 0x1234,
 *     pc: 0x100
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('InvalidJumpError', (error) => {
 *   console.log(`Invalid jump to ${error.destination} from pc ${error.pc}`)
 * })
 * ```
 */
export class InvalidJumpError extends InvalidJumpError_base {
    /**
     * JSON-RPC error code for EVM execution error.
     * @type {number}
     */
    static code: number;
    /**
     * Path to documentation for this error
     * @type {string}
     */
    static docsPath: string;
    /**
     * Constructs a new InvalidJumpError
     * @param {Object} props - Error properties
     * @param {number} [props.destination] - The invalid jump destination
     * @param {number} [props.pc] - The program counter
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        destination?: number | undefined;
        pc?: number | undefined;
        message?: string | undefined;
        cause?: unknown;
    });
    /**
     * The invalid jump destination
     * @readonly
     * @type {number | undefined}
     */
    readonly destination: number | undefined;
    /**
     * The program counter where the jump was attempted
     * @readonly
     * @type {number | undefined}
     */
    readonly pc: number | undefined;
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
//# sourceMappingURL=InvalidJumpError.d.ts.map