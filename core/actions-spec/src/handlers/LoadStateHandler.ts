import type { LoadStateParams } from '../index.js'
import type { LoadStateResult } from '../result/LoadStateResult.js'

/**
 * Loads a previously dumped state into the VM
 *
 * State can be dumped as follows
 * @example
 * ```typescript
 * const {state} = await tevm.dumpState()
 * fs.writeFileSync('state.json', JSON.stringify(state))
 * ```
 *
 * And then loaded as follows
 * @example
 * ```typescript
 * const state = JSON.parse(fs.readFileSync('state.json'))
 * await tevm.loadState({state})
 * ```
 */
export type LoadStateHandler = (
	params: LoadStateParams,
) => Promise<LoadStateResult>
