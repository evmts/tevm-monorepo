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
