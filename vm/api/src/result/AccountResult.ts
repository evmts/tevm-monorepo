import type { AccountError } from '../errors/AccountError.js'

/**
 * Result of Account Action
 */
export type AccountResult<ErrorType = AccountError> = {
	/**
	 * Description of the exception, if any occurred
	 */
	errors?: ErrorType[]
}
