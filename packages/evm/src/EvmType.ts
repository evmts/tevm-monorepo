import type { EVM as EthereumEVM } from '@evmts/zevm/evm'
import { type StateManager } from '@tevm/state'
import { type CustomPrecompile } from './CustomPrecompile.js'
import { type EVMOpts } from './EvmOpts.js'

export type EvmOptions = {
	common: any
	stateManager: StateManager
	blockchain: any
}

export type Evm = Omit<EthereumEVM, 'stateManager'> & {
	stateManager: StateManager

	addCustomPrecompile: (precompile: CustomPrecompile) => void
	removeCustomPrecompile: (precompile: CustomPrecompile) => void
}

export declare const Evm: {
	create: (options?: EVMOpts) => Promise<Evm>
	prototype: Evm
}
