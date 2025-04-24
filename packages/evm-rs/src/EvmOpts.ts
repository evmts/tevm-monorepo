import type { CustomPrecompile } from './CustomPrecompile.js'

/**
 * Options for the EVM, following ethereumjs format
 */
export type EVMOpts = {
  common?: any
  stateManager?: any
  blockchain?: any
  customPrecompiles?: CustomPrecompile[]
  allowUnlimitedContractSize?: boolean
  allowUnlimitedInitCodeSize?: boolean
  customOpcodes?: any[]
  profiler?: {
    enabled?: boolean
  }
}