declare const NodeNotReadyError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "NodeNotReadyError";
} & Readonly<A>;
/**
 * TaggedError representing a node not ready error.
 *
 * This error occurs when attempting to use a TEVM node before it has finished
 * initializing, typically when async setup like forking is still in progress.
 *
 * @example
 * ```typescript
 * import { NodeNotReadyError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new NodeNotReadyError({
 *     reason: 'Fork synchronization in progress'
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('NodeNotReadyError', (error) => {
 *   console.log(`Node not ready: ${error.reason}`)
 * })
 * ```
 */
export class NodeNotReadyError extends NodeNotReadyError_base {
    /**
     * JSON-RPC error code for resource unavailable.
     * @type {number}
     */
    static code: number;
    /**
     * Path to documentation for this error
     * @type {string}
     */
    static docsPath: string;
    /**
     * Constructs a new NodeNotReadyError
     * @param {Object} props - Error properties
     * @param {string} [props.reason] - The reason the node is not ready
     * @param {string} [props.message] - Optional custom message
     * @param {unknown} [props.cause] - The underlying cause of this error
     */
    constructor(props?: {
        reason?: string | undefined;
        message?: string | undefined;
        cause?: unknown;
    });
    /**
     * The reason why the node is not ready
     * @readonly
     * @type {string | undefined}
     */
    readonly reason: string | undefined;
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
//# sourceMappingURL=NodeNotReadyError.d.ts.map