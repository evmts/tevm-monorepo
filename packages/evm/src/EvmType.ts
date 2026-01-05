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
  _customPrecompiles: CustomPrecompile[]
  precompiles: Map<string, any>
  DEBUG: boolean
  journal: any
  allowUnlimitedContractSize: boolean
  events: {
    on(event: string, listener: (...args: any[]) => void): void
    off(event: string, listener: (...args: any[]) => void): void
    emit(event: string, ...args: any[]): boolean
    once(event: string, listener: (...args: any[]) => void): void
    removeAllListeners(event?: string): void
  }
  constructor(opts: { stateManager: StateManager; common: any; blockchain: any } & EVMOpts)
  getPrecompile(address: EthjsAddress): any | undefined
  addCustomPrecompile(precompile: CustomPrecompile): void
  removeCustomPrecompile(precompile: CustomPrecompile): void
  runCall(opts: EvmRunCallOpts): Promise<EvmResult>
  /** Create a shallow copy of the EVM instance */
  shallowCopy(): Evm
  /** Get active opcodes for current hardfork */
  getActiveOpcodes(): Map<number, any>
  static create(options?: EVMOpts & { stateManager: StateManager; common: any; blockchain: any }): Promise<Evm>
}
