import type { LoadStateError } from '@tevm/errors'

/**
 * Result of LoadState Method
 */
export type LoadStateResult<ErrorType = LoadStateError> = {
	/**
	 * Description of the exception, if any occurred
	 */
	errors?: ErrorType[]
}
