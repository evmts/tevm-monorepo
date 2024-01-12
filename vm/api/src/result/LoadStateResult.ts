import type { LoadStateError } from '../errors/LoadStateError.js'

/**
 * Result of Account Action
 */
export type LoadStateResult<ErrorType = LoadStateError> = {
	/**
	 * Description of the exception, if any occurred
	 */
	errors?: ErrorType[]
}
