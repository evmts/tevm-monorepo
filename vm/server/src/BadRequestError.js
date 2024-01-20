/**
 * Error thrown when request is malformed
 */
export class BadRequestError extends Error {
	/**
	 * @type {'BadRequestError'}
	 * @override
	 */
	name = 'BadRequestError'
	/**
	 * @type {'BadRequestError'}
	 */
	_tag = 'BadRequestError'
}
