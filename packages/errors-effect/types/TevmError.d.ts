declare const TevmError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "TevmError";
} & Readonly<A>;
/**
 * Base TaggedError for all TEVM errors in the Effect.ts ecosystem.
 * This provides a common structure for all TEVM errors with typed error handling.
 *
 * @example
 * ```typescript
 * import { TevmError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new TevmError({
 *     message: 'Something went wrong',
 *     code: -32000,
 *     docsPath: '/reference/tevm/errors/classes/tevmerror/'
 *   }))
 * })
 * ```
 */
export class TevmError extends TevmError_base {
    /**
     * Constructs a new TevmError
     * @param {Object} props - Error properties
     * @param {string} props.message - Human-readable error message
     * @param {number} [props.code=0] - JSON-RPC error code
     * @param {string} [props.docsPath] - Path to documentation for this error
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props: {
        message: string;
        code?: number | undefined;
        docsPath?: string | undefined;
        cause?: unknown;
    });
    /**
     * The error message
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
     * Path to documentation for this error
     * @readonly
     * @type {string | undefined}
     */
    readonly docsPath: string | undefined;
    /**
     * The underlying cause of this error, if any
     * @override
     * @readonly
     * @type {unknown}
     */
    override readonly cause: unknown;
}
export {};
//# sourceMappingURL=TevmError.d.ts.map