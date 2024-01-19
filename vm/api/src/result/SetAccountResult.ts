import type { SetAccountError } from '../errors/SetAccountError.js'

/**
 * Result of SetAccount Action
 */
export type SetAccountResult<ErrorType = SetAccountError> = {
	/**
	 * Description of the exception, if any occurred
	 */
	errors?: ErrorType[]
}
