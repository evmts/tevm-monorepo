import type { DumpStateParams } from './DumpStateParams.js';
import type { DumpStateResult } from './DumpStateResult.js';
/**
 * Dumps the current state of the VM into a JSON-serializable object.
 *
 * This handler allows you to capture the entire state of the VM, which can be useful for
 * debugging, testing, or persisting the state across sessions.
 *
 * @example
 * ```typescript
 * // Dumping the state
 * const { state } = await tevm.dumpState()
 * fs.writeFileSync('state.json', JSON.stringify(state))
 * ```
 *
 * @example
 * ```typescript
 * // Loading the state
 * const state = JSON.parse(fs.readFileSync('state.json'))
 * await tevm.loadState({ state })
 * ```
 *
 * @param params - Optional parameters to customize the state dumping process.
 * @returns A promise that resolves to a `DumpStateResult` object containing the state data.
 *
 * @see LoadStateHandler for loading the dumped state back into the VM.
 */
export type DumpStateHandler = (params?: DumpStateParams) => Promise<DumpStateResult>;
//# sourceMappingURL=DumpStateHandlerType.d.ts.map