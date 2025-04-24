import type { Chain } from '@tevm/blockchain'
import type { Common } from '@tevm/common'
import type { LogOptions } from '@tevm/logger'
import type { Predeploy } from '@tevm/predeploys'
import type { StateManager } from '@tevm/state'
import type { CustomPrecompile } from './CustomPrecompile.js'

/**
 * Options for creating an EVM instance
 */
export type CreateEvmOptions = {
  /**
   * The logging level to run the evm at. Defaults to 'warn'
   */
  loggingLevel?: LogOptions['level']
  /**
   * Ethereumjs common object
   */
  common: Common
  /**
   * A custom Tevm state manager
   */
  stateManager: StateManager
  /**
   * Enable profiler. Defaults to false.
   */
  profiler?: boolean
  blockchain: Chain
  /**
   * Custom precompiles allow you to run arbitrary JavaScript code in the EVM.
   */
  customPrecompiles?: CustomPrecompile[]
  /**
   * Custom predeploys allow you to deploy arbitrary EVM bytecode to an address.
   */
  customPredeploys?: ReadonlyArray<Predeploy<any, any>>
  /**
   * Enable/disable unlimited contract size. Defaults to false.
   */
  allowUnlimitedContractSize?: boolean
}