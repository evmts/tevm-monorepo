import { Data } from 'effect'

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
export class NodeNotReadyError extends Data.TaggedError('NodeNotReadyError') {
	/**
	 * JSON-RPC error code for resource unavailable.
	 * @type {number}
	 */
	static code = -32002

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/nodenotreadyerror/'

	/**
	 * The reason why the node is not ready
	 * @readonly
	 * @type {string | undefined}
	 */
	reason

	/**
	 * Human-readable error message
	 * @override
	 * @readonly
	 * @type {string}
	 */
	message

	/**
	 * JSON-RPC error code
	 * @readonly
	 * @type {number}
	 */
	code

	/**
	 * Path to documentation
	 * @readonly
	 * @type {string}
	 */
	docsPath

	/**
	 * The underlying cause of this error, if any.
	 * @override
	 * @readonly
	 * @type {unknown}
	 */
	cause

	/**
	 * Constructs a new NodeNotReadyError
	 * @param {Object} props - Error properties
	 * @param {string} [props.reason] - The reason the node is not ready
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		super({})
		/** @override @type {string} */
		this.name = 'NodeNotReadyError'
		this.reason = props.reason
		this.message =
			props.message ??
			(props.reason !== undefined
				? `Node not ready: ${props.reason}`
				: 'Node is not ready')
		this.code = NodeNotReadyError.code
		this.docsPath = NodeNotReadyError.docsPath
		this.cause = props.cause
	}
}
