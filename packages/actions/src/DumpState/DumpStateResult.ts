import type { SerializableTevmState } from '@tevm/state'
import type { TevmDumpStateError } from './TevmDumpStateError.js'

/**
 * Result of the dumpState method.
 *
 * This type represents the possible results of executing the `dumpState` method in TEVM.
 * It includes the serialized TEVM state and any errors that may have occurred.
 */
export type DumpStateResult<ErrorType = TevmDumpStateError> = {
	/**
	 * The serialized TEVM state.
	 *
	 * This property contains the entire state of the TEVM, serialized into a JSON-compatible
	 * format. This state can be used for debugging, analysis, or state persistence.
	 */
	state: SerializableTevmState
	/**
	 * Description of the exception, if any occurred.
	 *
	 * This property contains an array of errors that may have occurred during the execution
	 * of the `dumpState` method. Each error provides detailed information about what went wrong.
	 */
	errors?: ErrorType[]
}
