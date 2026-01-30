import { Data } from 'effect'

/**
 * @typedef {`0x${string}`} Hex
 */

/**
 * TaggedError representing a snapshot not found error.
 *
 * This error occurs when attempting to revert to a snapshot that does not exist,
 * typically because it was never created or has been garbage collected.
 *
 * @example
 * ```typescript
 * import { SnapshotNotFoundError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new SnapshotNotFoundError({
 *     snapshotId: '0x1234567890abcdef'
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('SnapshotNotFoundError', (error) => {
 *   console.log(`Snapshot not found: ${error.snapshotId}`)
 * })
 * ```
 */
export class SnapshotNotFoundError extends Data.TaggedError('SnapshotNotFoundError') {
	/**
	 * JSON-RPC error code for resource not found.
	 * @type {number}
	 */
	static code = -32001

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/snapshotnotfounderror/'

	/**
	 * The snapshot ID that was not found
	 * @readonly
	 * @type {Hex | string | undefined}
	 */
	snapshotId

	/**
	 * Human-readable error message
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
	 * @readonly
	 * @type {unknown}
	 */
	cause

	/**
	 * Constructs a new SnapshotNotFoundError
	 * @param {Object} props - Error properties
	 * @param {Hex | string} [props.snapshotId] - The snapshot ID that was not found
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		super()
		/** @type {string} */
		this.name = 'SnapshotNotFoundError'
		this.snapshotId = props.snapshotId
		this.message =
			props.message ??
			(props.snapshotId !== undefined
				? `Snapshot '${props.snapshotId}' not found`
				: 'Snapshot not found')
		this.code = SnapshotNotFoundError.code
		this.docsPath = SnapshotNotFoundError.docsPath
		this.cause = props.cause
	}
}
