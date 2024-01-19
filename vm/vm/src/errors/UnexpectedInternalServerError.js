/**
 * Error that is thrown when something unexpected happens
 * THis error being thrown indicates a bug or unhandled error
 * internally in tevm and thus shouldn't happen often
 */
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
