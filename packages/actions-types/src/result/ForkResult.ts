import type { ForkError } from '@tevm/errors'
/**
 * @experimental This is an unimplemented experimental feature
 */
export type ForkResult<ErrorType extends ForkError = ForkError> =
	| {
		/**
		 * The id of the forked network
		 */
		forkId: bigint
		/**
		 * Description of the exception, if any occurred
		 */
		errors?: never
	}
	| {
		/**
		 * The id of the forked network
		 */
		forkId?: never
		/**
		 * Description of the exception, if any occurred
		 */
		errors: ErrorType[]
	}
