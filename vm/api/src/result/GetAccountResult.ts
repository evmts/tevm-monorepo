import type { GetAccountError } from '../errors/GetAccountError.js'

/**
 * Result of GetAccount Action
 */
export type GetAccountResult<ErrorType = GetAccountError> = {
	/**
	 * Description of the exception, if any occurred
	 */
	errors?: ErrorType[]
}
