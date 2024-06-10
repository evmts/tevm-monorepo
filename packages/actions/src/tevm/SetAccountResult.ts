import type { SetAccountError } from '@tevm/errors'

/**
 * Result of SetAccount Action
 */
export type SetAccountResult<ErrorType = SetAccountError> = {
	/**
	 * Description of the exception, if any occurred
	 */
	errors?: ErrorType[]
}
