import type { EthjsAddress } from '@tevm/utils'

/**
 * Custom precompile definition for EVM
 */
export type PrecompileDefinition = {
  address: EthjsAddress
  function: (params: { data: Uint8Array; gasLimit: bigint }) => Promise<{
    returnValue: Uint8Array
    executionGasUsed: bigint
  }>
}

/**
 * Minimal EVM options for Guillotine adapter.
 * Extended/ignored options are accepted but may be unused.
 */
export type EVMOpts = {
  allowUnlimitedContractSize?: boolean
  profiler?: boolean
  loggingLevel?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'
  customPrecompiles?: PrecompileDefinition[]
}
