/**
 * Minimal EVM options for Guillotine adapter.
 * Extended/ignored options are accepted but may be unused.
 */
export type EVMOpts = {
  allowUnlimitedContractSize?: boolean
  profiler?: boolean
  loggingLevel?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'
}
