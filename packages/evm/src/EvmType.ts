import { EVM as EthereumEVM } from '@ethereumjs/evm'
import { type StateManager } from '@tevm/state'
import { type CustomPrecompile } from './CustomPrecompile.js'
import { type EVMOpts } from './EvmOpts.js'

export type EvmOptions = {
	common: any
	stateManager: StateManager
	blockchain: any
}

export declare class Evm extends EthereumEVM {
	stateManager: StateManager
	protected _customPrecompiles: CustomPrecompile[]

	addCustomPrecompile(precompile: CustomPrecompile): void
	removeCustomPrecompile(precompile: CustomPrecompile): void
	static create(options?: EVMOpts): Promise<Evm>
}
