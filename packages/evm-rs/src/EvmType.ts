import { type StateManager } from '@tevm/state'
import { type CustomPrecompile } from './CustomPrecompile.js'
import { type EVMOpts } from './EvmOpts.js'

export type EvmOptions = {
  common: any
  stateManager: StateManager
  blockchain: any
}

export declare class Evm {
  stateManager: StateManager
  protected _customPrecompiles: CustomPrecompile[]

  ready(): Promise<void>
  addCustomPrecompile(precompile: CustomPrecompile): void
  removeCustomPrecompile(precompile: CustomPrecompile): void
  runCall(callData: any): Promise<any>
  static create(options?: EVMOpts): Promise<Evm>
}