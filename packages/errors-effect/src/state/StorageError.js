import { Data } from 'effect'

/**
 * @typedef {`0x${string}`} Address
 * @typedef {`0x${string}`} Hex
 */

/**
 * TaggedError representing a storage access error.
 *
 * This error occurs when there's an issue accessing or modifying contract storage,
 * such as invalid storage keys, permission issues, or internal state errors.
 *
 * @example
 * ```typescript
 * import { StorageError } from '@tevm/errors-effect'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   yield* Effect.fail(new StorageError({
 *     address: '0x1234567890123456789012345678901234567890',
 *     key: '0x0000000000000000000000000000000000000000000000000000000000000001'
 *   }))
 * })
 *
 * // Pattern matching
 * Effect.catchTag('StorageError', (error) => {
 *   console.log(`Storage error for ${error.address} at key ${error.key}`)
 * })
 * ```
 */
export class StorageError extends Data.TaggedError('StorageError') {
	/**
	 * JSON-RPC error code for internal error.
	 * @type {number}
	 */
	static code = -32603

	/**
	 * Path to documentation for this error
	 * @type {string}
	 */
	static docsPath = '/reference/tevm/errors/classes/storageerror/'

	/**
	 * The contract address where the storage error occurred
	 * @readonly
	 * @type {Address | undefined}
	 */
	address

	/**
	 * The storage key that caused the error
	 * @readonly
	 * @type {Hex | undefined}
	 */
	key

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
	 * Constructs a new StorageError
	 * @param {Object} props - Error properties
	 * @param {Address} [props.address] - The contract address
	 * @param {Hex} [props.key] - The storage key
	 * @param {string} [props.message] - Optional custom message
	 * @param {unknown} [props.cause] - The underlying cause of this error
	 */
	constructor(props = {}) {
		// Compute all property values BEFORE calling super() for Effect.ts equality/hashing
		const name = 'StorageError'
		const address = props.address
		const key = props.key
		const message = props.message
			? props.message
			: props.address !== undefined && props.key !== undefined
				? `Storage error for account ${props.address} at key ${props.key}`
				: props.address !== undefined
					? `Storage error for account ${props.address}`
					: 'Storage access error'
		const code = StorageError.code
		const docsPath = StorageError.docsPath
		const cause = props.cause

		// Pass all properties to super() for Effect.ts equality and hashing
		super({ name, address, key, message, code, docsPath, cause })

		/** @override @type {string} */
		this.name = name
		this.address = address
		this.key = key
		this.message = message
		this.code = code
		this.docsPath = docsPath
		this.cause = cause
	}
}
