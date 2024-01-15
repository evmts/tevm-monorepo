import type { SerializableTevmState } from '@tevm/state'
import type { DumpStateError } from '../errors/DumpStateError.js'

/**
 * Result of Account Action
 */
export type DumpStateResult<ErrorType = DumpStateError> = {
	/**
	 * The serialized tevm state
	 */
	state: SerializableTevmState
	/**
	 * Description of the exception, if any occurred
	 */
	errors?: ErrorType[]
}
