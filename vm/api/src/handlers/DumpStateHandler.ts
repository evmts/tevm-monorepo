import type { DumpStateResult } from '../index.js'

/**
 * Handler for account tevm procedure
 */
export type DumpStateHandler = () => Promise<DumpStateResult>
