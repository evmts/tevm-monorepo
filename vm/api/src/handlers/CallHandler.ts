import type { CallParams, CallResult } from '../index.js'

/**
 * Executes a call against the VM. It is similar to `eth_call` but has more
 * options for controlling the execution environment
 *
 * See `contract` and `script` which executes calls specifically against deployed contracts
 * or undeployed scripts
 * @example
 * const res = tevm.call({
 * to: '0x123...',
 * data: '0x123...',
 * from: '0x123...',
 * gas: 1000000,
 * gasPrice: 1n,
 * skipBalance: true,
 * }
 *
 */
export type CallHandler = (action: CallParams) => Promise<CallResult>
