import type { ForkParams, ForkResult } from '../index.js'
/**
 * Forks the network with the given config.
 * If no config is provided it will fork the network that is currently connected.
 * If there is no config and no connected network, it will throw an error.
 * @throws {@link import('@tevm/errors').ForkError}
 * @example
 * const res = tevm.getAccount({address: '0x123...'})
 * console.log(res.deployedBytecode)
 * console.log(res.nonce)
 * console.log(res.balance)
 */
export type ForkHandler = (params: ForkParams) => Promise<ForkResult>
