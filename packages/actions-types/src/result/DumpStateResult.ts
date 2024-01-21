import type { DumpStateError } from '@tevm/errors'
import type { SerializableTevmState } from '@tevm/state'

/**
 * Result of the dumpState method
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
