/**
 * Error when a given JSON-RPC method is not supported
 */
export class UnsupportedMethodError extends Error {
	/**
	 * @type {'UnsupportedMethodError'}
	 * @override
	 */
	name = 'UnsupportedMethodError'
	/**
	 * @type {'UnsupportedMethodError'}
	 */
	_tag = 'UnsupportedMethodError'
	/**
	 * @param {string} method
	 */
	constructor(method) {
		super(`Unsupported method ${method}`)
	}
}
