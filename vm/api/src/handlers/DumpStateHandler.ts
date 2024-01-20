import type { DumpStateResult } from '../index.js'

/**
 * Handler for dumpState tevm procedure. Dumps the entire state into a {@link DumpStateResult}
 * @example
 * const {errors, state} = await tevm.dumpState()
 */
export type DumpStateHandler = () => Promise<DumpStateResult>
