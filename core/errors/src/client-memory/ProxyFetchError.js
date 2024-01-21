/**
 * Error when there is a problem with the underlying forked provider
 * Potentially could be network issues
 */
export class ProxyFetchError extends Error {
	/**
	 * @type {'ProxyFetchError'}
	 * @override
	 */
	name = 'ProxyFetchError'
	/**
	 * @type {'ProxyFetchError'}
	 */
	_tag = 'ProxyFetchError'
	/**
	 * @param {string} method
	 */
	constructor(method) {
		super(`Unable to proxy request ${method} to underlying provider`)
	}
}
