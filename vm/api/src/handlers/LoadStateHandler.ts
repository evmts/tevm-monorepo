import type { LoadStateParams } from '../index.js'
import type { LoadStateResult } from '../result/LoadStateResult.js'

/**
 * Handler for load state tevm procedure
 * @example
 * const {errors} = await tevm.loadState({ state: { '0x....': '0x....' } })
 */
export type LoadStateHandler = (
	params: LoadStateParams,
) => Promise<LoadStateResult>
