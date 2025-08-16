import { type TevmLoadStateError } from './TevmLoadStateError.js';
/**
 * Result of the `tevmLoadState` method.
 *
 * This type represents the result returned by the `tevmLoadState` method. It includes any errors that might have occurred during the state loading process.
 *
 * @example
 * ```typescript
 * import { createClient } from 'tevm'
 * import { loadStateHandler } from 'tevm/actions'
 * import fs from 'fs'
 *
 * const client = createClient()
 * const loadState = loadStateHandler(client)
 *
 * const state = JSON.parse(fs.readFileSync('state.json'))
 * const result = await loadState({ state })
 * if (result.errors) {
 *   console.error('Failed to load state:', result.errors)
 * }
 * ```
 *
 * @see {@link TevmLoadStateError}
 */
export type LoadStateResult<ErrorType = TevmLoadStateError> = {
    /**
     * Description of the exception, if any occurred.
     */
    errors?: ErrorType[];
};
//# sourceMappingURL=LoadStateResult.d.ts.map