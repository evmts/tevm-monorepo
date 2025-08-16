import type { LoadStateParams } from './LoadStateParams.js';
import type { LoadStateResult } from './LoadStateResult.js';
/**
 * Loads a previously dumped state into the VM.
 *
 * State can be dumped as follows:
 * @example
 * ```typescript
 * import { dumpStateHandler } from 'tevm/actions'
 * import { createClient } from 'tevm'
 * import fs from 'fs'
 *
 * const client = createClient()
 * const dumpState = dumpStateHandler(client)
 *
 * const { state } = await dumpState()
 * fs.writeFileSync('state.json', JSON.stringify(state))
 * ```
 *
 * And then loaded as follows:
 * @example
 * ```typescript
 * import { loadStateHandler } from 'tevm/actions'
 * import { createClient } from 'tevm'
 * import fs from 'fs'
 *
 * const client = createClient()
 * const loadState = loadStateHandler(client)
 *
 * const state = JSON.parse(fs.readFileSync('state.json'))
 * await loadState({ state })
 * ```
 *
 * Note: This handler is intended for use with the low-level TEVM TevmNode, unlike `tevmLoadState` which is a higher-level API function.
 *
 * @param {LoadStateParams} params - The parameters for loading the state.
 * @returns {Promise<LoadStateResult>} The result of the load state operation.
 */
export type LoadStateHandler = (params: LoadStateParams) => Promise<LoadStateResult>;
//# sourceMappingURL=LoadStateHandlerType.d.ts.map