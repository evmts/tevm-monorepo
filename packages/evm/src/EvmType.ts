import { type StateManager } from '@tevm/state'
import { type CustomPrecompile } from './CustomPrecompile.js'
import { type EVMOpts } from './EvmOpts.js'
import type { EvmRunCallOpts, EvmResult } from './types.js'

export type EvmOptions = {
	common: any
	stateManager: StateManager
	blockchain: any
}

export declare class Evm {
  stateManager: StateManager
  common: any
  blockchain: any
  protected _customPrecompiles: CustomPrecompile[]
  journal: any
  constructor(opts: { stateManager: StateManager; common: any; blockchain: any } & EVMOpts)
  addCustomPrecompile(precompile: CustomPrecompile): void
  removeCustomPrecompile(precompile: CustomPrecompile): void
  runCall(opts: EvmRunCallOpts): Promise<EvmResult>
  static create(options?: EVMOpts & { stateManager: StateManager; common: any; blockchain: any }): Promise<Evm>
}
