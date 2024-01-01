export class UnexpectedInternalServerError extends Error {
	/**
	 * @type {'UnexpectedInternalServerError'}
	 * @override
	 */
	name = 'UnexpectedInternalServerError'
	/**
	 * @type {'UnexpectedInternalServerError'}
	 */
	_tag = 'UnexpectedInternalServerError'
	/**
	 * @param {string} method
	 */
	constructor(method) {
		super(`Unexpected Internal error for ${method}`)
	}
}
