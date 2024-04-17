import type { CreateEvmOptions } from './CreateEvmOptions.js'
import { Evm } from './Evm.js'

/**
 * Creates the Tevm Evm to execute ethereum bytecode
 * Wraps [ethereumjs EVM](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm)
 * @returns A tevm Evm instance with tevm specific defaults
 */
export const createEvm = ({
  common,
  stateManager,
  blockchain,
  customPrecompiles,
  profiler,
  allowUnlimitedContractSize,
}: CreateEvmOptions): Promise<Evm> => {
  return Evm.create({
    common,
    stateManager,
    blockchain,
    allowUnlimitedContractSize: allowUnlimitedContractSize ?? false,
    allowUnlimitedInitCodeSize: false,
    customOpcodes: [],
    // TODO uncomment the mapping once we make the api correct
    // Edit: nvm not letting this block a stable release maybe update it next major
    customPrecompiles: customPrecompiles ?? [],
    profiler: {
      enabled: profiler ?? false,
    },
  })
}
