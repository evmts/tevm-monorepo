import type { InternalError } from '@tevm/errors';
/**
 * Error type for `tevmLoadState`.
 *
 * This type represents the possible errors that can occur during the execution of the `tevmLoadState` method.
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
 * @see {@link InternalError}
 */
export type TevmLoadStateError = InternalError;
//# sourceMappingURL=TevmLoadStateError.d.ts.map