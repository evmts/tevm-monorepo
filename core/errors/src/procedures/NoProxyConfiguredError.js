/**
 * Error thrown when a action or request cannot be fulfilled
 * without a proxy url being configured
 */
export class NoProxyConfiguredError extends Error {
	/**
	 * @type {'NoProxyConfiguredError'}
	 * @override
	 */
	name = 'NoProxyConfiguredError'
	/**
	 * @type {'NoProxyConfiguredError'}
	 */
	_tag = 'NoProxyConfiguredError'
	/**
	 * @param {string} method
	 */
	constructor(method) {
		super(
			`Invalid jsonrpc request: Current server is not configured to accept non-tevm requests. Received ${method} method`,
		)
	}
}
