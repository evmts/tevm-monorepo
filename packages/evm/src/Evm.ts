import { EVM } from '@ethereumjs/evm'
import type { StateManager } from '@tevm/state'
import type { EVMOpts } from './EvmOpts.js'

/**
 * A wrapper around the EVM to expose some protected functionality of the EVMStateManger
 * Ideally we find a way to remove this complexity and replace with a normal `action`
 * @internal
 */
export class Evm extends EVM {
	public declare static create: (options?: EVMOpts) => Promise<Evm>
	public declare stateManager: StateManager
}
