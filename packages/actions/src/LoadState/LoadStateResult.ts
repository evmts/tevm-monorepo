import { type TevmLoadStateError } from './TevmLoadStateError.js'

/**
 * Result of LoadState Method
 */
export type LoadStateResult<ErrorType = TevmLoadStateError> = {
	/**
	 * Description of the exception, if any occurred
	 */
	errors?: ErrorType[]
}
