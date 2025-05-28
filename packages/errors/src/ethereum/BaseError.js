// This code is originally from viem
/**
 * Utility function to get the version.
 * @returns {string} The version string.
 */
const getVersion = () => '1.1.0.next-73'

/**
 * @typedef {Object} BaseErrorParameters
 * @property {string} [docsBaseUrl] - Base URL for the documentation.
 * @property {string} [docsPath] - Path to the documentation.
 * @property {string} [docsSlug] - Slug for the documentation.
 * @property {string[]} [metaMessages] - Additional meta messages.
 * @property {BaseError|Error|import('@ethereumjs/evm').EVMError|unknown} [cause] - The cause of the error.
 * @property {string} [details] - Details of the error.
 */

/**
 * @typedef {Object} BaseErrorType
 * @property {string} _tag - Internal tag for the error.
 * @property {string} name - The name of the error.
 * @property {string} message - Human-readable error message.
 * @property {string} details - Details of the error.
 * @property {string|undefined} [docsPath] - Path to the documentation for this error.
 * @property {string} shortMessage - Short message describing the error.
 * @property {string} version - The version of the library.
 * @property {number} code - Error code, analogous to the code in JSON RPC error.
 * @property {Function} walk - Function to walk through the error chain.
 */

/**
 * Base class for custom errors in TEVM.
 * This class is abstract and should be extended by other error classes.
 * @abstract
 * @extends {Error}
 * @implements {BaseErrorType}
 */
export class BaseError extends Error {
	/**
	 * @param {string} shortMessage - A short, human-readable summary of the error.
	 * @param {BaseErrorParameters} args={} - Additional parameters for the error.
	 * @param {string} _tag - Internal tag for the error.
	 * @param {number} [code] - Error code analogous to the code in JSON RPC error.
	 */
	constructor(shortMessage, args, _tag, code = 0) {
		if (new.target === BaseError) {
			throw new TypeError('Cannot construct BaseError instances directly')
		}
		super()

		const details = (() => {
			if (args.cause === null || args.cause === undefined) {
				return ''
			}
			if (args.cause instanceof BaseError) {
				return args.cause.docsPath
			}
			if (typeof args.cause === 'string') {
				return args.cause
			}
			if (typeof args.cause !== 'object') {
				return args
			}
			if ('message' in args.cause) {
				return /** @type {string}*/ (args.cause.message)
			}
			if (args.cause instanceof Error) {
				if ('errorType' in args.cause) {
					return args.cause.errorType
				}
			}
			try {
				return JSON.stringify(args.cause)
			} catch (e) {
				return 'Unable to parse error details'
			}
		})()
		const docsPath = args.cause instanceof BaseError ? args.cause.docsPath || args.docsPath : args.docsPath
		/**
		 * @type {string}
		 */
		this._tag = _tag
		/**
		 * @type {string}
		 */
		this.name = _tag
		if (details) {
			/**
			 * @type {string}
			 */
			this.details = /** @type {string}*/ (details)
		}
		/**
		 * @type {string|undefined}
		 */
		this.docsPath = docsPath
		/**
		 * @type {string[]|undefined}
		 */
		this.metaMessages = args.metaMessages
		/**
		 * @type {string}
		 */
		this.shortMessage = shortMessage
		/**
		 * @type {string}
		 */
		this.version = getVersion()
		/**
		 * @type {number}
		 */
		this.code = code
		if (args.cause) {
			this.cause = /**@type {any} */ (args.cause)
		}

		/**
		 * @type {string}
		 */
		this.message = [
			shortMessage || 'An error occurred.',
			'',
			...(args.metaMessages ? [...args.metaMessages, ''] : []),
			...(docsPath
				? [`Docs: ${args.docsBaseUrl ?? 'https://tevm.sh'}${docsPath}${args.docsSlug ? `#${args.docsSlug}` : ''}`]
				: []),
			...(details ? [`Details: ${details}`] : []),
			`Version: ${this.version}`,
		].join('\n')
	}

	/**
	 * Walks through the error chain.
	 * @param {Function} [fn] - A function to execute on each error in the chain.
	 * @returns {Error|unknown} The first error that matches the function, or the original error.
	 */
	walk(fn) {
		return walk(this, fn)
	}
}

/**
 * Helper function to walk through the error chain.
 * @param {unknown} err - The error to walk through.
 * @param {Function} [fn] - A function to execute on each error in the chain.
 * @returns {unknown} The first error that matches the function, or the original error.
 */
function walk(err, fn) {
	if (fn?.(err)) return err
	if (err && typeof err === 'object' && 'cause' in err) return walk(err.cause, fn)
	return fn ? null : err
}
