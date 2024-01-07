// TODO add this as type to api and then make this implement the type
/**
 * Internal utility for making sure every request is handled via expecting a request of type never
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
	 * @param {never} request
	 */
	constructor(request) {
		super(`Unknown method in request: ${JSON.stringify(request)}`)
	}
}
