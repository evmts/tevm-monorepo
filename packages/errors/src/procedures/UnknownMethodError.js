// TODO add this as type to api and then make this implement the type
// Internal utility for making sure every request is handled via expecting a request of type never
/**
 * Error thrown when a request is made with an unknown method
 */
export class UnknownMethodError extends Error {
	/**
	 * @type {'UnknownMethodError'}
	 * @override
	 */
	name = 'UnknownMethodError'
	/**
	 * @type {'UnknownMethodError'}
	 */
	_tag = 'UnknownMethodError'
	/**
	 * @param {never} request a request that must be of type `never` such that all valid requests are handled
	 */
	constructor(request) {
		super(`Unknown method in request: ${JSON.stringify(request)}`)
	}
}
