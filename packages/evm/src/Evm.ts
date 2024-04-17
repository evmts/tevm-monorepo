import type { EVMOpts } from './EvmOpts.js'
import { EVM } from '@ethereumjs/evm'
import type { TevmStateManager } from '@tevm/state'

/**
 * A wrapper around the EVM to expose some protected functionality of the EVMStateManger
 * Ideally we find a way to remove this complexity and replace with a normal `action`
 * @internal
 */
export class Evm extends EVM {
	public declare static create: (options?: EVMOpts) => Promise<Evm>
	public declare stateManager: TevmStateManager
}
