import { type StateManager } from '@tevm/state'
import { type EthjsAddress } from '@tevm/utils'
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
  precompiles: Map<string, any>
  DEBUG: boolean
  journal: any
  constructor(opts: { stateManager: StateManager; common: any; blockchain: any } & EVMOpts)
  getPrecompile(address: EthjsAddress): any | undefined
  addCustomPrecompile(precompile: CustomPrecompile): void
  removeCustomPrecompile(precompile: CustomPrecompile): void
  runCall(opts: EvmRunCallOpts): Promise<EvmResult>
  static create(options?: EVMOpts & { stateManager: StateManager; common: any; blockchain: any }): Promise<Evm>
}
