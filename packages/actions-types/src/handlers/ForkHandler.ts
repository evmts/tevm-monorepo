import type { ForkParams, ForkResult } from '../index.js'
/**
 * Triggers a fork against the given fork config. If no config is provided it will fork the current state
 * If the current state is not proxying to an RPC and is just a vanilla VM it will throw
 *
 * Block tag is optional and defaults to 'latest'
 * @throws {@link import('@tevm/errors').ForkError}
 * @example
 * ```typescript
 * const {errors} = await tevm.fork({
 *   url: 'https://mainnet.infura.io/v3',
 *   blockTag: 'earliest',
 * })
 * ```
 */
export type ForkHandler = (params: ForkParams) => Promise<ForkResult>
