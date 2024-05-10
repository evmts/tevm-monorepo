import { createLogger } from '@tevm/logger';
import type { CreateEvmOptions } from './CreateEvmOptions.js'
import { Evm } from './Evm.js'

/**
 * Creates the Tevm Evm to execute ethereum bytecode
 * Wraps [ethereumjs EVM](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm)
 * @returns A tevm Evm instance with tevm specific defaults
 */
export const createEvm = async ({
  common,
  stateManager,
  blockchain,
  customPrecompiles,
  profiler,
  allowUnlimitedContractSize,
  loggingLevel,
}: CreateEvmOptions): Promise<Evm> => {
  const logger = createLogger({
    name: '@tevm/evm',
    level: loggingLevel ?? 'warn'
  })
  logger.debug({ allowUnlimitedContractSize, profiler, customPrecompiles: customPrecompiles?.map(c => c.address.toString()) })
  const evm = await Evm.create({
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
  if (logger.level === 'trace') {
    // we are hacking ethereumjs logger into working with our logger
    const evmAny = evm as any
    evmAny.DEBUG = true
    evmAny._debug = logger
  }
  return evm
}
