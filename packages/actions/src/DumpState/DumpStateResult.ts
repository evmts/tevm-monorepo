import type { TevmState } from '@tevm/state'
import type { TevmDumpStateError } from './TevmDumpStateError.js'

/**
 * Result of the dumpState method
 */
export type DumpStateResult<ErrorType = TevmDumpStateError> = {
	/**
	 * The serialized tevm state
	 */
	state: TevmState
	/**
	 * Description of the exception, if any occurred
	 */
	errors?: ErrorType[]
}
