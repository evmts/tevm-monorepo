import type { LoadStateParams } from '../index.js'
import type { LoadStateResult } from '../result/LoadStateResult.js'

/**
 * Handler for load state tevm procedure
 */
export type LoadStateHandler = (
	params: LoadStateParams,
) => Promise<LoadStateResult>